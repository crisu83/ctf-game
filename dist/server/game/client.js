'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key]}}}return target};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value' in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _shortid=require('shortid');var _shortid2=_interopRequireDefault(_shortid);var _lodash=require('lodash');var _vendor=require('../helpers/vendor');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}var CONNECT_DELAY=750;var Client=function(){ /**
   * Creates a new game client.
   * @param {Server} server
   * @param socket
   */function Client(server,socket){_classCallCheck(this,Client);this._server=server;this._socket=socket;this._channel=null;this._id=_shortid2.default.generate();this._session=null;this._playerId=null;this._socket.on('latency',this.handleLatency.bind(this));_vendor.logger.info('client.connect (client_id: '+this._id+')')} /**
   * Connects this client to a game session.
   * @param {Session} session
   */_createClass(Client,[{key:'joinSession',value:function joinSession(session){var _this=this;var playerProps=_extends({},session.getGameData('entities.player'),{id:_shortid2.default.generate(),name:_vendor.chance.first()});session.addPlayer(playerProps);this._channel=this._socket.join(session.channel);this._channel.on('disconnect',this.handleDisconnect.bind(this));this._channel.on('action',this.handleAction.bind(this));setTimeout(function(){playerProps=(0,_lodash.find)(session.gameState.entities,function(props){return props.id===playerProps.id});_this._channel.emit('ready',_this._id,session.gameData,session.gameState,playerProps);_this._session=session;_this._playerId=playerProps.id;_vendor.logger.info('client.join (client_id: '+_this._id+', session_id: '+session.id+')')},CONNECT_DELAY)} /**
   * Disconnects the client from the current game session.
   */},{key:'leaveSession',value:function leaveSession(){if(!this._session){return}this._channel.leave();_vendor.logger.info('client.leave (client_id: '+this._id+', session_id: '+this._session.id+')');this._session.removePlayer(this._playerId);this._session=null} /**
   * Called each time the client pings the server.
   * @param {number} timestamp
   */},{key:'handleLatency',value:function handleLatency(timestamp){this._socket.emit('latency',timestamp)} /**
   * Called each time an action is received from the browser.
   * @param {Object} action
   */},{key:'handleAction',value:function handleAction(action){if(this._session){ // TODO: Add a white-list for client actions and check against that.
// TODO: Consider adding a limit for how often actions will be dispatched.
this._session.handleClientAction(action)}} /**
   * Called when the connection to the browser is lost.
   */},{key:'handleDisconnect',value:function handleDisconnect(){if(this._session){this.leaveSession()}this._server.removeClient(this._id);_vendor.logger.info('client.disconnected (client_id: '+this._id+')')} /**
   * Returns the id of this client.
   * @returns {string}
   */},{key:'id',get:function get(){return this._id}}]);return Client}();exports.default=Client;
//# sourceMappingURL=client.js.map