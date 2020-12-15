import os
import datetime
import shutil
import sys
import time
import subprocess
import imghdr
from pathlib import Path
from getpass import getuser

#Camera index
CAMERA_INDEX = "/dev/video0"

#Tuple with image supported filles
supported_files = ("png","jpg","jpeg")
target_directory = "/home/"+getuser()+"/Desktop/photos/"


#Check if any camera is detected
def check_camera(camera_resource):
  camera_file = Path(camera_resource)
  
  if camera_file.exists():
    return 0
  else:
    raise TypeError("Camera not found")


#Get date and generate a jpg file name
def photo_name():
  now = datetime.datetime.now()
  name = str(now.year)+"-"+str(now.month)+"-"+str(now.day)+"-"+str(now.hour)+"-"+str(now.minute)+"-"+str(now.second)
  name = str(name)+".jpg"
  return name


#Generate folder where the pictures will be stored at first
def photo_location(file_name):
  return sys.path[0]+"/"+file_name


#Take picture from camera with 800x480 resolution in jpeg format and move it to Desktop/photos folder
def take_picture(file_location):
  photo_subprocess = subprocess.run(["fswebcam","-r","800x480","--jpeg","80","--no-banner","--save",file_location])
  if photo_subprocess.stderr != None:
    raise TypeError("Error taking picture")
  else:
    return 0


#Move picture from current directory to the target directory
def move_picture(file_name, file_location):
  
  if Path(file_location).exists():
    if not Path(target_directory).exists():
      Path(target_directory).mkdir()

    shutil.move(file_location,target_directory+file_name)
    return 0
  else:
    raise TypeError("Can't move picture, file doesn't exist")
  

#Verifies the picture generated exists correspond with the supported file extensions, after that 
#open the picture with EOG
def show_picture(file_name):
  file_location = target_directory+file_name
  try:
    imghdr.what(file_location)
  except FileNotFoundError:
    print("File not found")
    return 1
  else:
    if imghdr.what(file_location) in supported_files:
      try:
        eog_subprocess = subprocess.run(["eog", "-f", file_location], timeout=3)
      except subprocess.TimeoutExpired:
        print("EOG Closed")
        return 0


def main():

  #Close any previous execution of EOG
  os.system("killall -9 eog")
  
  check_camera(CAMERA_INDEX)
  file_name = photo_name()
  file_location = photo_location(file_name)
  take_picture(file_location)
  move_picture(file_name, file_location)
  show_picture(file_name)
    
  return 0  


if __name__ == '__main__':
 main()
