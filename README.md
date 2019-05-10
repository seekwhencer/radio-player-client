# radio-player-client
The client app for the [radio automation]() to use it on a internet connected raspberry pi.

## Installing the app

After setting up the raspberry pi.

- create folder
```
sudo su
mkdir /data
chown pi:pi /data
exit
```

- clone and install
```
cd /data
git clone https://github.com/seekwhencer/radio-player-client.git
cd radio-player-client/app
npm install
```

- persist app launch on boot with pm2
```
sudo su
cd /data/radio-player-client/app
pm2 start "npm run dev" --name "radioclient"
pm2 save
```


## Setup the Raspberry pi
- burn latest Raspbian LITE on a 8 GB SD
- change the password of user **`pi`**
```
passwd
```

- set the network name
```
echo "radioclient" | sudo tee /etc/hostname
```

- change keyboard if you want
```
sudo nano /etc/default/keyboard
```
Replace `gb` with `de`

- enabling ssh
```
sudo raspi-config
```
navigate to `interfacing options` then activate ssh and reboot

-  installing some needs
```
sudo apt-get update -y
sudo apt-get install git curl make omxplayer -y
sudo apt-get upgrade -y
```

- installing node with n for root user
```
sudo su
cd ~
curl -L https://git.io/n-install | bash
```

- installing PM2
```
sudo su
npm install pm2 -g
pm2 startup
```

- setup network
```
sudo nano /etc/network/interfaces
```
use this:
```
auto lo
iface lo inet loopback
 
auto eth0
allow-hotplug eth0
iface eth0 inet dhcp
 
auto wlan0
allow-hotplug wlan0
iface wlan0 inet dhcp
wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf
```

- setup wifi
```
sudo nano /etc/wpa_supplicant/wpa_supplicant.conf
```
use this:
```
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=DE
 
network={
 priority=100
 ssid="YOUR!SSID"
 scan_ssid=1
 proto=RSN
 key_mgmt=WPA-PSK
 pairwise=CCMP
 group=TKIP CCMP
 psk="YOUR!PSK"
}
```
Replace `YOUR!SSD` and `YOUR!PSK`
