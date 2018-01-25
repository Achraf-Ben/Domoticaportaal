import socket
from gpiozero import Button, LED

class Main:
    def __init__(self):
        #maak verbinding met server

        HOST =
        PORT = 4040

        self.clientsocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.clientsocket.connect((HOST, PORT))

    def alarm(self):
        'stuurt alarmmelding naar de server'
        button = Button(17)

        #op knopje gedrukt
        if button.is_pressed:
            self.clientsocket.send('alarmmelding')


    def verlichting(self):
        'krijgt een bericht binnen van de server en zet de verlichting aan/uit'
        led = LED(2)

        data = self.clientsocket.recv(1024)

        if data == 'licht-aan':
            led.on()
        if data == 'licht-uit':
            led.off()

    def camera(self):

