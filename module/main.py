from threading import Thread
from subprocess import call, check_output
from gpiozero import Button, LED
import socket
import json
import netifaces
from time import sleep
import cv2
from PIL import Image
import threading
class Main:
    def __init__(self):
        """ Maak verbinding met de server en registreer de module """
	
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



    def activate_camera(self, alarm=False):
        """ Activeert de camera als die nog niet aan staat """

        if not self.camera_on:
            self.camera_on = True
            output = check_output(['/usr/local/bin/streamer.sh'])

            while "failure" in output.lower():
                sleep(1)
                output = check_output(['/usr/local/bin/streamer.sh'])

            sleep(3)    # geef de camera de tijd om op te starten

            if alarm:
                pkg = json.dumps({'msg': 'alarm'})
            elif: 
                pkg = json.dumps({'msg': 'camera_on'})
            
            self.socket.send(pkg.encode())
        else: 
            print("Camera already streaming")
            
    def deactivate_camera(self):
        """ Schakelt de camera uit als deze aan staat"""

        if self.camera_on:
            self.camera_on = False 
            
            call(['/usr/local/bin/stop_stream.sh'])

            pkg = json.dumps({'msg': 'camera_off'});
            self.socket.send(pkg.encode())
        else:
            print("Camera not streaming")
            
    
    def alarm(self):
        """stuurt alarmmelding naar de server"""
        button = Button(17)
        while True:
            #op knopje gedrukt
            if button.is_pressed and self.alarm_triggered == False:
                self.alarm_triggered = True
                activate_camera_thread = Thread(target=self.activate_camera, args=(True,), daemon=True)
                activate_camera_thread.start()

    def keep_alive(self):
        """ Stuurt een signaal over de tcp_socket om de verbinding open te houden """

        while True:
            pkg = json.dumps({'msg':'keepalive'})
            self.socket.send(pkg.encode());
            sleep(5)

    def socket_handler(self):
        """ Handel binnekomende TCP socket berichten af """
        led = LED(2)
        while True:
            data = self.socket.recv(1024)

            if not data:
                break
            
            data = data.decode()

            if data == 'light_on':
                led.on()
            if data == 'light_off':
                led.off()
            if data == 'alarm_off':
                self.alarm_triggered = False
                self.deactivate_camera()
            if data == 'camera_on':
                activate_camera_thread = Thread(target=self.activate_camera, args=(True,), daemon=True)
                activate_camera_thread.start()
            if data == 'camera_off':
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
