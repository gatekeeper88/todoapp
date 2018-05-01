dirs="client api"
for i in $dirs
do
   echo "Building:"$i
   cd $i
   npm install
   cd ..
done