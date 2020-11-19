import os
import datetime
import shutil
import time
import subprocess

def main():
  os.system("killall -9 eog")
  now = datetime.datetime.now()
  name = str(now.year)+"-"+str(now.month)+"-"+str(now.day)+"-"+str(now.hour)+"-"+str(now.minute)+"-"+str(now.second)
  name = str(name)+".jpg"
  os.system("fswebcam -r 800x480 --jpeg 80 --no-banner --save " + name)
  os.system("mv "+name+" /home/lupe/Desktop/photos/"+name)
  shutil.move(name,"/home/lupe/Desktop/photos/"+name)
  time.sleep(1)
    
  try:
    eog_subprocess = subprocess.run(["eog", "-f", "/home/hochob/HeyAmikoo/Image/"+name], timeout=3)
  except subprocess.TimeoutExpired:
    print("EOG Closed")

  return 0  

if __name__ == '__main__':
 main()
