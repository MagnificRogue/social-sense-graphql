var {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLList,
	GraphQLInt,
	GraphQLBoolean
} = require('graphql');

var twitterAPI = require('./../../API/twitterAPI');

// root
const twitterQueryType = module.exports = new GraphQLObjectType({
	name:'twitterQuery',
	description:'Query user, tweet, geolocation by keywords.',
	fields: () => ({
		queryUser:{
			type: new GraphQLList(twtUserType),
			args:{
				q:		{ 	type:GraphQLString,
							description:'The search query to run against people search.' 
						},
				count:	{ 	type:GraphQLInt,
							defaultValue:3,
							description:'The number of potential user results to retrieve per page. This value has a maximum of 20.' 
						},
				pageNum: 	{ 	type: GraphQLInt,
							defaultValue:5,
							description: 'madeup field; the aggregated pages' 
						}
			},
			//resolve: (twitter,args) => searchUser(twitter.args, args)
			// redditAPI(headers, resolveName = 'search', id='', args = args)
			resolve: (_,args,context) => twitterAPI(context,resolveName = 'searchUser', id='',args=args)
		},
		queryTweet:{
			type: new GraphQLList(tweetType),
			args:{
				q:		{	
							type:GraphQLString,
							description:`A UTF-8, URL-encoded search query of 500 characters maximum, 
										including operators. Queries may additionally be limited 
										by complexity.`
						},
				count:	{	
							type:GraphQLInt,
							defaultValue:3,
							description:`The number of tweets to return per page, up to a maximum of 100. 
										Defaults to 15. This was formerly the “rpp” parameter in the 
										old Search API.`
						},
				pages: 	{
							type:GraphQLInt,
							defaultValue:3,
							description:`This is not in the original twitter api. This fields is the iterator that append new pages
										to the search. if you specify the number of pages you want to go through, you will get the 
										amount of tweets = count * pages; detail check out API/twitterAPI.js and the max_id,since_id fields
										in twitter restful API documentation.`
				},
				geocode:{
							type:GraphQLString,
							description: '37.781157 -122.398720 1mi'
						},
				result_type:{
								type:GraphQLString,
								defaultValue:'mixed',
								description:`Optional. Specifies what type of search results you would prefer 
											to receive. The current default is “mixed.” Valid values include:
											* mixed : Include both popular and real time results in the response.
											* recent : return only the most recent results in the response
											* popular : return only the most popular results in the response.`
							},
				locale:		{  
								type:GraphQLString,
								defaultValue:'en',
								description:`Specify the language of the query you are sending 
											(only ja is currently effective). This is intended for 
											language-specific consumers and the default should work in 
											the majority of cases.`
							},
				until:		{
								type:GraphQLString,
								description:`Returns tweets created before the given date. Date should
											be formatted as YYYY-MM-DD. Keep in mind that the search index 
											has a 7-day limit. In other words, no tweets will be found 
											for a date older than one week.`
							},
				lang:		{
								type:GraphQLString,
								defaultValue:'en'
							}
			},
			//resolve: (_,args) => searchTweet(args)
			resolve: (_,args,context) => twitterAPI(context,resolveName = 'searchTweet', id='',args=args)
		},
		getTimeline:{
			type: new GraphQLList(tweetType),
			args:{
				user_id:{	
							type:GraphQLString,
							description:`The ID of the user for whom to return results.`
						},
				screen_name:	{	
							type:GraphQLString,
							description:`The screen name of the user for whom to return results.`
						},
				since_id: 	{
							type:GraphQLString,
							description:`Returns results with an ID greater than (that is, more recent than) 
							the specified ID. There are limits to the number of Tweets that can be accessed 
							through the API. If the limit of Tweets has occured since the since_id, the 
							since_id will be forced to the oldest ID available.`
				},
				count:{
							type:GraphQLInt,
							description: `Specifies the number of Tweets to try and retrieve, up to 
							a maximum of 200 per distinct request. The value of count is best thought 
							of as a limit to the number of Tweets to return because suspended or deleted
							content is removed after the count has been applied. We include retweets in 
							the count, even if include_rts is not supplied. It is recommended you always 
							send include_rts=1 when using this API method.`
						},
				max_id:{
								type:GraphQLString,
								description:`Returns results with an ID less than (that is, older than) or equal to the specified ID.`
							},
				trim_user:		{  
								type:GraphQLBoolean,
								description:`When set to either true , t or 1 , each Tweet returned in a timeline will include 
								a user object including only the status authors numerical ID. Omit this parameter to receive 
								the complete user object.`
							},
				exclude_replies:{
								type:GraphQLBoolean,
								description:`This parameter will prevent replies from appearing in the returned timeline. 
								Using exclude_replies with the count parameter will mean you will receive up-to count 
								tweets — this is because the count parameter retrieves that many Tweets before filtering 
								out retweets and replies`
							},
				include_rts:{
								type:GraphQLBoolean,
								description:`When set to false , the timeline will strip any native retweets 
								(though they will still count toward both the maximal length of the timeline 
								and the slice selected by the count parameter). Note: If you’re using the 
								trim_user parameter in conjunction with include_rts, the retweets will still 
								contain a full user object.`
							}
			},
			//resolve: (_,args) => searchTweet(args)
			resolve: (_,args,context) => twitterAPI(context,resolveName = 'fetchTimeline', id=args.user_id,args=args)
		},
		queryGeo: {
			type: new GraphQLList(twtGeoType),
			args:{
				query:	{	
						type:GraphQLString,
						description:`Free-form text to match against while executing a geo-based query, 
									best suited for finding nearby locations by name. Remember 
									to URL encode the query.`
					},
				ip: {
						type:GraphQLString,
						description:`An IP address. Used when attempting to fix geolocation based 
									off of the user’s IP address.`
					},
				lat: {
						type:GraphQLString,
						description:`eg. 37.7821120598956`
					},
				long:{
						type:GraphQLString,
						description:`eg. -122.400612831116`
					},
				granularity:{
								type:GraphQLString,
								description:`This is the minimal granularity of place types to return and 
											must be one of: poi , neighborhood , city , admin or country . 
											If no granularity is provided for the request neighborhood is assumed.
											Setting this to city , for example, will find places which have 
											a type of city , admin or country .`
							},
				accuracy: 	{
								type:GraphQLString,
								description:`A hint on the “region” in which to search. If a number, then this 
								is a radius in meters, but it can also take a string that is suffixed with ft to 
								specify feet. If this is not passed in, then it is assumed to be 0m . If coming 
								from a device, in practice, this value is whatever accuracy the device has measuring 
								its location (whether it be coming from a GPS, WiFi triangulation, etc.).`
							},
				max_results:{
								type:GraphQLString,
								description:`A hint as to the number of results to return. This does not guarantee 
								that the number of results returned will equal max_results, but instead informs how 
								many “nearby” results to return. Ideally, only pass in the number of places you 
								intend to display to the user here.`
							}
			},
			//resolve: (_,args) => searchGeo(args)
			resolve: (_,args,context) => twitterAPI(context,resolveName = 'searchGeo', id='',args=args)
		}
	})
});

const twtUserType = require('./twitter-type/twtUserType');
const tweetType = require('./twitter-type/twtTweetType');
const twtGeoType = require('./twitter-type/twtGeoType');
