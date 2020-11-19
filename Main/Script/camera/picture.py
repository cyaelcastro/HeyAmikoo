import os
import datetime
import shutil
import time
import subprocess


def photo_name():
  now = datetime.datetime.now()
  name = str(now.year)+"-"+str(now.month)+"-"+str(now.day)+"-"+str(now.hour)+"-"+str(now.minute)+"-"+str(now.second)
  name = str(name)+".jpg"
  return name


def take_picture(file_name):
  os.system("fswebcam -r 800x480 --jpeg 80 --no-banner --save " + file_name)
  os.system("mv "+file_name+" /home/lupe/Desktop/photos/"+file_name)
  shutil.move(file_name,"/home/lupe/Desktop/photos/"+file_name)
  return "/home/lupe/Desktop/photos/"+file_name


def show_picture(file_location):
  try:
    eog_subprocess = subprocess.run(["eog", "-f", file_location], timeout=3)
  except subprocess.TimeoutExpired:
    print("EOG Closed")


def main():

  os.system("killall -9 eog")
  
  file_name = photo_name()
  file_location = take_picture(file_name)
  show_picture(file_location)
    
  return 0  


if __name__ == '__main__':
 main()
