rsync -avz --delete \
--exclude node_modules \
--exclude .next \
--exclude public \
--exclude .git \
-e "ssh -i ~/.ssh/tax-server-key.pem" \
./ ubuntu@13.124.98.132:/home/ubuntu/projects/insurance-user-frontend/

ssh -i ~/.ssh/tax-server-key.pem ubuntu@13.124.98.132 "
cd ~/projects/insurance-user-frontend &&
yarn build &&
pm2 restart insurance-user-frontend
"
