import os
import datetime
import shutil
import time
import subprocess
import imghdr

#Tuple with image supported filles
supported_files = ("png","jpg","jpeg")


#Get date and generate a jpg file name
def photo_name():
  now = datetime.datetime.now()
  name = str(now.year)+"-"+str(now.month)+"-"+str(now.day)+"-"+str(now.hour)+"-"+str(now.minute)+"-"+str(now.second)
  name = str(name)+".jpg"
  return name
 
#Take picture from camera with 800x480 resolution in jpeg format and move it to Desktop/photos folder
def take_picture(file_name):
  photo_subprocess = subprocess.run(["fswebcam","-r","800x480","--jpeg","80","--no-banner","--save",file_name])
  shutil.move(file_name,"/home/lupe/Desktop/photos/"+file_name)
  return "/home/lupe/Desktop/photos/"+file_name


#Verifies the picture generated exists correspond with the supported file extensions, after that 
#open the picture with EOG
def show_picture(file_location):
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
  
  file_name = photo_name()
  file_location = take_picture(file_name)
  show_picture(file_location)
    
  return 0  


if __name__ == '__main__':
 main()
