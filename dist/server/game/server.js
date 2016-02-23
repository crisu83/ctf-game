'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value' in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _castle=require('./sessions/castle');var _castle2=_interopRequireDefault(_castle);var _client=require('./client');var _client2=_interopRequireDefault(_client);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}var Server=function(){ /**
   * Creates a new game server.
   * @param io
   */function Server(io){_classCallCheck(this,Server);this._io=io;this._clients=[];this._sessions=[]} /**
   * Boots the game server.
   */_createClass(Server,[{key:'boot',value:function boot(){var session=new _castle2.default(this._io);this.addSession(session);session.start();this._io.on('connection',this.handleConnection.bind(this))} /**
   * Adds a session to the server's session pool.
   * @param {Session} session
   */},{key:'addSession',value:function addSession(session){this._sessions.push(session)} /**
   * Adds a client to the server's client pool.
   * @param {Client} client
   */},{key:'addClient',value:function addClient(client){this._clients.push(client)} /**
   * Removes a client from the server's client pool.
   * @param {string} id
   */},{key:'removeClient',value:function removeClient(id){this._clients=this._clients.filter(function(client){return client.id!==id})} /**
   * Called when a client connects to the server.
   * @param socket
   */},{key:'handleConnection',value:function handleConnection(socket){var client=new _client2.default(this,socket);this.addClient(client);this.findSessionForClient(client)} /**
   * Finds a suitable session for a client.
   * @param {Client} client
   */},{key:'findSessionForClient',value:function findSessionForClient(client){var session=this._sessions[0];client.joinSession(session)}}]);return Server}();exports.default=Server;
//# sourceMappingURL=server.js.map