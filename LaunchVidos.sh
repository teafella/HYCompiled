#!/bin/bash
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/home/pi/lib/ndi

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
cd $DIR

# gpio mode 14 in
# gpio mode 15 in
# gpio mode 16 in

# BUTTON1="$(gpio read 14)"
# BUTTON2="$(gpio read 15)"
# BUTTON3="$(gpio read 16)"

# Set pins to white
# {0,1, 2}, {3, 4, 5}, {6,7,13}
# gpio mode 0 out
# gpio mode 1 out
# gpio mode 2 out
# gpio mode 3 out
# gpio mode 4 out
# gpio mode 5 out
# gpio mode 6 out
# gpio mode 7 out
# gpio mode 13 out

#enter clone mode if all buttons are held on startup
# if [[ 1 == ${BUTTON1} && 1 == ${BUTTON2} && 1 == ${BUTTON3} ]]; then 
#     echo "ENTER CLONE MODE"
#     gpio write 0 0
# 	gpio write 1 0
# 	gpio write 2 1
# 	gpio write 3 0
# 	gpio write 4 0
# 	gpio write 5 1
# 	gpio write 6 0
# 	gpio write 7 0
# 	gpio write 13 1
# 	# while [ 1 ]; do
# 	# 	ls
# 	# 	cd ..
# 	# 	sudo ./clone.sh
# 	# done

# else
	# gpio write 0 0
	# gpio write 1 0
	# gpio write 2 0
	# gpio write 3 0
	# gpio write 4 0
	# gpio write 5 0
	# gpio write 6 0
	# gpio write 7 0
	# gpio write 13 0

	#sudo raspi-config --expand-rootfs

	# sudo systemctl enable getty@ttyGS0.service #for mirroring the terminal to upstream serial device

	# while true 
	# do
	# git pull
	#camera driver suggessted optimizations ( in .)
	sudo rmmod uvcvideo
	sudo modprobe uvcvideo timeout=5000 nodrop=1  quirks=0x80 #

	# # make sure other instances arent running
	# sudo systemctl stop v
	# sudo systemctl stop vidos

	sudo nice --18 ./main.out  2>&1 | tee /home/pi/VIDOS/log.txt
	# ./main.out
	# done

# fi 


