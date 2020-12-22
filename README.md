# kurral_api

Steps to deploy:
serverless config credentials --provider aws --key <API_KEY> --secret <Secret_Key>

sudo yarn clean
 
sudo yarn build
 
sudo yarn run package

Might need to login to serverless

sudo yarn run deploy


#Run Offline
serverless offline start --printOutput
