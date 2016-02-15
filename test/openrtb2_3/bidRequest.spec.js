var moment = require('moment');
var tk = require('timekeeper');
var RtbObject = require('../../lib/rtbObject');
var BidRequest = require('../../lib/openrtb2_3/bidRequest').object;
var BidRequestBuilder = require('../../lib/openrtb2_3/bidRequest').builder;

describe("BidRequest tests", function() {

	before(function(){
		var time = moment.utc('2015-01-14T00:00:00').format(); //Janurary 14 2015,
		//Freeze time
		tk.freeze(time);
	});

	after(function(){
		tk.reset(); // Reset
	});

	describe("The BidRequest object should", function() {
		it("be an instance of RtbObject", function() {
		  var bidRequest = new BidRequest();
		  bidRequest.should.be.an.instanceof(RtbObject);      
		});
	});


	describe("The BidRequestBuilder should", function() {

		it("build a valid bid request object", function() {
		  var builder = new BidRequestBuilder();
		  var bidRequest = builder
		  .timestamp(moment.utc().format())
		  .id('1234')
		  .at(2)
		  .imp([
		      {
		          "id":"1",
		          "native":{
		            "api": [ 3 ], 
		            "battr": [ 13, 14 ],
		            "request": {
		              "ver": 1,
		              "layout": 6,
		              "assets": [
		                {
		                  "id": 0,
		                  "req": 1,
		                  "title": {
		                    "len": 25
		                  }
		                }, 
		                { 
		                  "id": 1, 
		                  "req": 1, 
		                  "img": { 
		                    "type": 3, 
		                    "wmin": 100, 
		                    "hmin": 100
		                  } 
		                },
		                {
		                  "id": 3, 
		                  "req": 0, 
		                  "data": { 
		                    "type": 2,
		                    "len": 90
		                  }                       
		                }
		              ]
		            }
		          },
		          "tagid": "eb09ff2a287598302fd631493949169b0d17f815",
		          "bidfloor": 1.3
		      }
		  ])
		  .app({
		      "id":"55",
		      "name":"Test App",
		      "bundle":"com.foo.example",
		      "cat":["IAB3-1"],
		      "storeurl": "http://www.example.com",
		      "publisher":{  
		          "id": "6332",
		          "name": 'publisher 1'
		      }
		  })
		  .device({
		    "dnt":0,
		    "ua":"Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K) AppleWebkit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30",
		    "ip":"76.174.49.222",
		    "ifa": "AA000DFE74168477C70D291f574D344790E0BB11",
		    "connectiontype":2,
		    "devicetype":1,
		    "didsha1": "bbc9ff2a287598302fd631693949169b0d17f215",
		    "carrier": "o2",
		    "make": "samsung GT-I9300",
		    "model": "Android",
		    "language": "en",
		    "os": "Android",
		    "osv": "5.1.1",
		    "geo": {
		        "country": "UK",
		        "lat": null,
		        "lon": null
		    }
		  })
		  .user({
		      "id":"55816b39711f9b5acf3b90e313ed29e51665623f",
		      "yob": 1987,
		      "gender": "M",
		  })
		  .bcat(["IAB10"])
		  .badv(["xxx.com"])
		  .tmax(200)
		  .ext({
		    'extra': '1234'
		  })
		  .build();

		  bidRequest.should.have.property('timestamp', "2015-01-14T00:00:00+00:00");
		  bidRequest.should.have.property('id', "1234");
		  bidRequest.should.have.property('at', 2);

		  //Check imp object
		  bidRequest.imp.length.should.equal(1);
		  bidRequest.imp[0].should.have.properties({
		    id: '1',
		    bidfloor: 1.3,
		    tagid: 'eb09ff2a287598302fd631493949169b0d17f815'
		  });

		  //Check imp.native object
		  var native = bidRequest.imp[0].native;
		  native.should.have.property('api', [3]);
		  native.should.have.property('battr', [13,14]);
		  native.should.have.property('request', {
		    assets: [
		      { id: 0, req: 1, title: { len: 25 } },
		      { id: 1, img: { hmin: 100, type: 3, wmin: 100 }, req: 1 },
		      { data: { len: 90, type: 2 }, id: 3, req: 0 }
		    ],
		    layout: 6,
		    ver: 1
		  });

		  //Check app object
		  bidRequest.app.should.have.properties({
		    cat: [ 'IAB3-1' ],
		    id: '55',
		    bundle: 'com.foo.example',
		    name: 'Test App',
		    storeurl: 'http://www.example.com'
		  });

		  //Check app.publisher object
		  bidRequest.app.publisher.should.have.properties({ id: '6332', name: 'publisher 1' });

		  //Check device object
		  bidRequest.device.should.have.properties({
		    carrier: 'o2',
		    connectiontype: 2,
		    didsha1: 'bbc9ff2a287598302fd631693949169b0d17f215',
		    ua: 'Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K) AppleWebkit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
		    ifa: 'AA000DFE74168477C70D291f574D344790E0BB11',
		    dnt: 0,
		    ip: '76.174.49.222',
		    geo: {
		      country: "UK"
		    },
		    language: 'en',
		    make: 'samsung GT-I9300',
		    model: 'Android',
		    os: 'Android',
		    osv: '5.1.1',
		    devicetype: 1
		  });

		  //Check user object
		  bidRequest.user.should.have.properties({
		    id: '55816b39711f9b5acf3b90e313ed29e51665623f',
		    gender: 'M',
		    yob: 1987
		  });

		  //Check bcat property
		  bidRequest.bcat.should.eql(["IAB10"]);

		  //Check badv property
		  bidRequest.badv.should.eql(["xxx.com"]);

		  //Check tmax property
		  bidRequest.tmax.should.equal(200);

		  //Check ext object
		  bidRequest.ext.should.have.properties({
		    'extra': '1234'
		  });
		});

		it("throw an error if a id was not provided", function() {
		  var builder = new BidRequestBuilder();
		  (function(){
		    builder
		    .timestamp(moment.utc().format())
		    .build();
		  }).should.throw('BidRequest should have an id');
		});

	});
});