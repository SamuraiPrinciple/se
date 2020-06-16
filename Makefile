define SYSTEMD_CONFIG
[Unit]
Description=RGS remote slot engine example

[Service]
User=build
Group=users
LimitNOFILE=1048576
LimitNPROC=1048576
WorkingDirectory=/opt/rgs-remote-slot-engine-example
ExecStart=/bin/node index.js 3030
Restart=always
RestartSec=1
StartLimitInterval=0

[Install]
WantedBy=multi-user.target
endef

export SYSTEMD_CONFIG

define NGINX_CONFIG
server {
    listen 443 ssl;
    server_name rgs-remote-slot-engine-example-dev.finrings.com;
    ssl_certificate /etc/ssl/finrings.com.combined.pem;
    ssl_certificate_key /etc/ssl/finrings.com.combined.pem;
    location / {
        proxy_pass http://localhost:3030/;
    }
}
endef

export NGINX_CONFIG

teamcity:
	@sudo mkdir -p /opt/rgs-remote-slot-engine-example
	@sudo cp *.js /opt/rgs-remote-slot-engine-example
	@sudo echo "$$SYSTEMD_CONFIG" | sudo tee /usr/lib/systemd/system/rgs-remote-slot-engine-example.service > /dev/null
	@sudo systemctl daemon-reload
	@sudo systemctl restart rgs-remote-slot-engine-example
	@sudo echo "$$NGINX_CONFIG" | sudo tee /etc/nginx/conf.d/rgs-remote-slot-engine-example.conf > /dev/null
	@sudo nginx -t && sudo service nginx reload
