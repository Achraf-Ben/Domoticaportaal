from threading import Thread
from subprocess import call, Popen, check_output
from gpiozero import Button, LED
import socket
import json
import netifaces
from time import sleep

class Main:
    def __init__(self):
        'maak verbinding met server'

        host = '192.168.42.7'
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
                print('registration complete, id is: {}\n'.format(self.id))
                return

    def activate_camera(self):
        if not self.camera_on:
            p = Popen(['/usr/local/bin/streamer.sh'])
            p.wait()
            sleep(1);
    
    def deactivate_camera(self):
        if not self.camera_on:
            p = Popen(['/usr/local/bin/stop_stream.sh'])
            p.wait()
    
    def alarm(self):
        'stuurt alarmmelding naar de server'
        button = Button(17)
        while True:
            #op knopje gedrukt
            if button.is_pressed and self.alarm_triggered == False:
                self.alarm_triggered = True
                
                camera_thread = Thread(target=self.activate_camera, daemon=True)
                camera_thread.start()
                
                pkg = json.dumps({'msg': 'alarm'})
                self.socket.send(pkg.encode())
    
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
                led.on()
            if data == 'light_off':
                led.off()
            if data == 'alarm_off':
                self.alarm_triggered = False
                self.deactivate_camera()
            if data == 'camera_on':
                if not self.camera_on:
                    self.camera_on = True
                    self.activate_camera()
            if data == 'camera_off':
                if self.camera_on:
                    self.camera_on = False
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