from threading import Thread
from subprocess import call, check_output
# from gpiozero import Button, LED
import socket
import json
import netifaces


class Main:
    def __init__(self):
        'maak verbinding met server'

        host = '192.168.42.7'
        port = 4040

        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.socket.connect((host, port))
        self.mac_address = netifaces.ifaddresses('eth0')[netifaces.AF_LINK][0]['addr']

        pkg = json.dumps({
            'msg': 'register',
            'mac_address': self.mac_address
        })
        self.socket.send(pkg.encode())

        while True:
            data = self.socket.recv(1024)

            if data:
                data = json.loads(data.decode())
                print(data)
                self.id = data['id']

    def alarm(self):
        'stuurt alarmmelding naar de server'
        button = Button(17)

        while True:
            op knopje gedrukt
            if button.is_pressed:
                pkg = json.dumps({'msg': 'alarm'})
                self.socket.send(pkg.encode())

    def socket_handler(self):
        led = LED(2)
        while True:
            data = self.socket.recv(1024)

            if not data:
                break

            data = json.loads(data)

            if data['msg'] == 'licht-aan':
                pass
                #led.on()
            if data['msg'] == 'licht-uit':
                pass
                #led.off()
            if data['msg'] == 'camera_on':
                output = check_output(['ps', '-A'])
                if 'mjpg_streamer' not in output:
                    call(['/usr/local/bin/mjpg_streamer', '-i "/usr/local/lib/input_uvc.so '
                                                          '-n -f 30 -r 640x480" '
                                                          '-o "/usr/local/lib/output_http.so -p.so '
                                                          '-p 10088 -w /usr/local/www" &'])
            if data['msg'] == 'camera_off':
                output = check_output(['ps', '-A'])
                if 'mjpg_streamer' in output:
                    call(['killall', 'mjpg_streamer'])


    def run(self):
        """ Start alle processen """

        socket_thread = Thread(target=self.socket_handler, daemon=True)
        alarm_thread = Thread(target=self.alarm, daemon=True)

        socket_thread.start()
        alarm_thread.start()


Main().run()