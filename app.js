//. app.js

var express = require( 'express' ),
    request = require( 'request' ),
    app = express();

require( 'dotenv' ).config();

var SLACK_USER_OAUTH_TOKEN = 'SLACK_USER_OAUTH_TOKEN' in process.env ? process.env.SLACK_USER_OAUTH_TOKEN : '';
var SLACK_CHANNEL_ID = 'SLACK_CHANNEL_ID' in process.env ? process.env.SLACK_CHANNEL_ID : '';

var settings_cors = 'CORS' in process.env ? process.env.CORS : '';
app.all( '/*', function( req, res, next ){
  if( settings_cors ){
    res.setHeader( 'Access-Control-Allow-Origin', settings_cors );
    res.setHeader( 'Access-Control-Allow-Methods', '*' );
    res.setHeader( 'Access-Control-Allow-Headers', '*' );
    res.setHeader( 'Vary', 'Origin' );
  }
  next();
});

app.use( express.Router() );
//app.use( express.static( __dirname + '/public' ) );

app.get( '/history', async function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );
  var channel_id = SLACK_CHANNEL_ID;
  if( req.query.channel_id ){ channel_id = req.query.channel_id; }

  if( SLACK_USER_OAUTH_TOKEN && channel_id ){
    var messages = await getDirectMessages( channel_id );
    var p = JSON.stringify( { status: true, messages: messages }, null, 2 );
    res.write( p );
    res.end();
  }else{
    var p = JSON.stringify( { status: false, error: 'No session found.' }, null, 2 );
    res.status( 400 );
    res.write( p );
    res.end();
  }
});

async function getDirectMessages( channel_id ){
  return new Promise( async ( resolve, reject ) => {
    var next_cursor = '';
    var messages = [];
    do{
      var r = await getDMs( channel_id, next_cursor );
      if( r.status ){
        r.messages.forEach( function( message ){
          messages.push( message );
        });
        next_cursor = r.next_cursor;
      }else{
        next_cursor = '';
      }
    }while( next_cursor );

    resolve( messages );
  });
}

async function getDMs( channel_id, next_cursor ){
  return new Promise( ( resolve, reject ) => {
    var messages = [];
    var option = {
      headers: {
        'Authorization': 'Bearer ' + SLACK_USER_OAUTH_TOKEN
      },
      //url: 'https://slack.com/api/im.history',
      url: 'https://slack.com/api/conversations.history',  //. DM もこれ
      method: 'POST',
      json: { channel: channel_id }
    };
    if( next_cursor ){
      option.json.cursor = next_cursor;
    }

    request( option, ( err0, res0, body0 ) => {
      if( err0 ){
        resolve( { status: false, messages: messages, error: err } );
      }else{
        if( typeof body0 == 'string' ){ body0 = JSON.parse( body0 ); }
        //console.log( {body0} );
        if( body0 && body0.ok ){
          body0.messages.forEach( function( message ){
            messages.push( message );
          });

          var next_cursor = '';
          if( body0.has_more && ( 'next_cursor' in body0.response_metadata ) ){
            next_cursor = body0.response_metadata.next_cursor;
          }

          resolve( { status: true, messages: messages, next_cursor: next_cursor } );
        }else{
          resolve( { status: false, messages: messages, error: body0 } );
        }
      }
    });
  });
}


var port = process.env.PORT || 8080;
app.listen( port );
console.log( "server stating on " + port + " ..." );
