
#!/bin/bash
#
# Run a NoSQL Test Sequence
# HTML Output in ./output folder
#
# runtest1.sh <basedir> <config:local|server> <cron:yes|no>
#

echo "#################################################"
echo "# Run Basic Replication Test (Test #1)"
echo "#################################################"

basedir=$1
config=$2
cron=$3

if [ "$basdir" = "" ]
then
	basedir="."
fi

if [ "$config" = "" ]
then
	config="local"
fi

if [ "$config" = "server" ]
then
	newman="/bin/newman"
else
	newman="newman"
fi

if [ "$cron" = "yes" ]
then
	it="-i"
else
	it="-it"
fi


# Run Ping Tests (Post Startup)

rm -f $basedir/output/newman-run*.html
$newman run $basedir/tests/NoteShare.postman_collection.json -r cli,html --reporter-html-export $basedir/output
mv $basedir/output/newman-run-*.html $basedir/output/00-nosql-ping-checks.html
