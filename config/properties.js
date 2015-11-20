// /config/properties.js

module.exports =
{
	// SERVER PROPERTIES
	ENV: process.env.NODE_ENV || '!dev',//dev or prod
	PORT: process.env.PORT || 8080,
	FAVICON: 'public/dev/img/favicon.png',

	// SESSION SECRET
	SECRET: 'G789H3IghJKHHOPyGOuiF3IUK05J3Hk9SD0M054LSs',
	
	/* DATABASES */
	// Redis properties (session)
	REDIS_URL: process.env.REDISCLOUD_URL ||
		'redis://rediscloud:1Y4WLwhuKdBvjhbl@pub-redis-15719.eu-west-1-1.2.ec2.garantiadata.com:15719',
	// MongoDB properties (memory)
	db_localhost: 'mongodb://localhost:27017/',// + database name
	db_store: 'mongodb://huminact:hiabebestapp@ds063168.mongolab.com:63168/store',
	db_user: 'mongodb://huminact:hiabebestapp@ds029979.mongolab.com:29979/user',
	db_memory: 'mongodb://huminact:hiabebestapp@ds059888.mongolab.com:59888/memory',
	db_log: 'mongodb://huminact:hiabebestapp@ds057538.mongolab.com:57538/logs',
	
};