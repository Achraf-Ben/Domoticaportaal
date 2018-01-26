from threading import Thread
from subprocess import call, check_output
import socket
from gpiozero import Button, LED


class Main:
    def __init__(self):
        'maak verbinding met server'

        host = '192.168.42.7'
        port = 4040

        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.socket.connect((host, port))

    def alarm(self):
        'stuurt alarmmelding naar de server'
        button = Button(17)

        while True:
            #op knopje gedrukt
            if button.is_pressed:
                self.socket.send('alarm')

    def socket_handler(self):
        led = LED(2)
        while True:
            data = self.socket.recv(1024)

            if not data:
                break

            if data == 'licht-aan':
                led.on()
            if data == 'licht-uit':
                led.off()
            if data == 'camera_on':
                output = check_output(['ps', '-A'])
                if 'mjpg_streamer' not in output:
                    call(['/usr/local/bin/mjpg_streamer', '-i "/usr/local/lib/input_uvc.so '
                                                          '-n -f 30 -r 640x480" '
                                                          '-o "/usr/local/lib/output_http.so -p.so '
                                                          '-p 10088 -w /usr/local/www" &'])
            if data == 'camera_off':

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