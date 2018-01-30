from threading import Thread
from subprocess import call, PIPE, Popen, check_output
from gpiozero import Button, LED
import socket
import json
import netifaces
from time import sleep
import cv2
from PIL import Image
import threading
from http.server import BaseHTTPRequestHandler,HTTPServer
from socketserver import ThreadingMixIn
from io import StringIO,BytesIO
import time
capture=None
streaming_server_on = False

class CamHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path.endswith('.mjpg'):
            self.send_response(200)
            self.send_header('Content-type','multipart/x-mixed-replace; boundary=--jpgboundary')
            self.end_headers()
            while True:
                try:
                    rc,img = capture.read()
                    if not rc:
                        continue
                    imgRGB=cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
                    jpg = Image.fromarray(imgRGB)
                    tmpFile = BytesIO()
                    jpg.save(tmpFile,'JPEG')
                    self.wfile.write("--jpgboundary".encode())
                    self.send_header('Content-type','image/jpeg')
                    self.send_header('Content-length',str(tmpFile.getbuffer().nbytes))
                    self.end_headers()
                    jpg.save(self.wfile,'JPEG')
                    time.sleep(0.05)
                except KeyboardInterrupt:
                    break
            return
        if self.path.endswith('.html'):
            self.send_response(200)
            self.send_header('Content-type','text/html')
            self.end_headers()
            self.wfile.write('<html><head></head><body>'.encode())
            self.wfile.write('<img src="http://127.0.0.1:10088/cam.mjpg"/>'.encode())
            self.wfile.write('</body></html>'.encode())
            return


class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Handle requests in a separate thread."""

def main():
    global capture
    capture = cv2.VideoCapture(0)
    capture.set(cv2.CAP_PROP_FRAME_WIDTH, 640); 
    capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 480);
    capture.set(cv2.CAP_PROP_SATURATION,0.2);
    global img
    try:
        server = ThreadedHTTPServer(('localhost', 10088), CamHandler)
        print( "server started")
        server.serve_forever()
    except KeyboardInterrupt:
        capture.release()
        server.socket.close()


class Main:
    def __init__(self):
        'maak verbinding met server'
	
        host = 'server.zorgtotaal.com'
        port = 4040

        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.socket.connect((host, port))
        self.mac_address = netifaces.ifaddresses('eth0')[netifaces.AF_LINK][0]['addr']
        self.alarm_triggered = False
        self.camera_on = False
        self.light_on = False
        
        print('registering with server...')
        
        pkg = json.dumps({
            'msg': 'register',
            'mac_address': self.mac_address
        })
        self.socket.send(pkg.encode())

        while True:
            data = self.socket.recv(1024)

            if data:
                data = json.loads(data.decode())
                self.id = data['id']
                print(('registration complete, id is: {}\n'.format(self.id)))
                return



    def activate_camera(self):
        if not self.camera_on:
            self.camera_on = True
            global capture
            capture = cv2.VideoCapture(0)
            capture.set(cv2.CAP_PROP_FRAME_WIDTH, 640); 
            capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 480);
            capture.set(cv2.CAP_PROP_SATURATION,0.2);
            global img
            try:
                self.server = ThreadedHTTPServer(('localhost', 10088), CamHandler)
                print( "server started")
                self.server.serve_forever()
            except KeyboardInterrupt:
                capture.release()
                server.socket.close()

            print("It's all running now....")
            pkg = json.dumps({'msg': 'camera_on'});
            self.socket.send(pkg.encode())
        else: 
            print("Camera already streaming")
            
    def deactivate_camera(self):
        if self.camera_on:
            self.camera_on = False 
            
            self.server.socket.close()

            print('camera off')
            pkg = json.dumps({'msg': 'camera_off'});
            self.socket.send(pkg.encode())
        else:
            print("Camera not streaming")
            
    
    def alarm(self):
        'stuurt alarmmelding naar de server'
        button = Button(17)
        while True:
            #op knopje gedrukt
            if button.is_pressed and self.alarm_triggered == False:
                self.alarm_triggered = True
                activate_camera_thread = Thread(target=self.activate_camera, args=(True,), daemon=True)
    
    def keep_alive(self):
        while True:
            pkg = json.dumps({'msg':'keepalive'})
            self.socket.send(pkg.encode());
            sleep(5)

    def socket_handler(self):
        led = LED(2)
        while True:
            data = self.socket.recv(1024)

            if not data:
                break
            
            data = data.decode()

            if data == 'light_on':
                print('light_on')
                led.on()
            if data == 'light_off':
                print('light off')
                led.off()
            if data == 'alarm_off':
                self.alarm_triggered = False
                self.deactivate_camera()
            if data == 'camera_on':
                print('camera_on')
                print((self.camera_on))
                self.activate_camera()
            if data == 'camera_off':
                print('camera_off')
                self.deactivate_camera()


    def run(self):
        """ Start alle processen """
        
        print('starting processes...')
        
        socket_thread = Thread(target=self.socket_handler, daemon=True)
        keep_alive_thread = Thread(target=self.keep_alive, daemon=True)
        
        socket_thread.start()
        keep_alive_thread.start()
        self.alarm()

Main().run()
