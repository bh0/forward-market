import serial
import binascii
import sys
import struct

ser = serial.Serial('/dev/ttyAMA0', 9600, timeout=1)

while True:
    ser.write('\x02')
    while(1):
        buf = ser.read(4)
        if len(buf) > 0:
	    print "Serial #:" ,

	    for i in buf:
	        value = struct.unpack('B', i)[0]
	        print "%02x" % (value),

            print ""

    string = ser.read(12)

    if len(string) == 0:
        print "Please insert a tag"
        continue
    else:



	print string.decode('utf-8')
	string = string[1:11] #exclude start x0A and stop x0D bytes

        if string == '0415DB18A3': 
            print "You used your black tag"
        elif string == '0F03028F57':
            print "You used your white tag"
        else:
            print "You do not have a valid tag"
