'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value' in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}(); /*eslint no-unused-vars: 0*/var _shortid=require('shortid');var _shortid2=_interopRequireDefault(_shortid);var _lodash=require('lodash');var _vendor=require('../helpers/vendor');var _store=require('../store');var _store2=_interopRequireDefault(_store);var _game=require('../actions/game');var _entity=require('../factories/entity');var _map=require('../factories/map');var _constants=require('../constants');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}} // TODO: Separate game logic and generic game session logic into two different classes.
var Session=function(){ /**
   * Creates a new game session.
   * @param {string} name
   * @param io
   */function Session(name,io){_classCallCheck(this,Session);this._name=name;this._io=io;this._id=_shortid2.default.generate();this._store=(0,_store2.default)();this._gameData=this.loadGameData();this._isRunning=false;this._lastTickAt=null;this._entities=[];this._packetSequence=0;this._lastSyncAt=null; // Notify each client every time the state is changed.
this._unsubscribeFromStore=this._store.subscribe(this.handleStateChange.bind(this));this.create()} /**
   * Loads the game data for this game session.
   * @returns {Object}
   */_createClass(Session,[{key:'loadGameData',value:function loadGameData(){return {assets:require(_constants.DATA_PATH+'/assets.json'),config:require(_constants.DATA_PATH+'/config.json'),entities:require(_constants.DATA_PATH+'/entities.json'),ui:require(_constants.DATA_PATH+'/ui.json'),map:(0,_map.createMap)(this._name,this._store.dispatch)}} /**
   * Creates this session.
   */},{key:'create',value:function create(){} /**
   * Starts this session.
   */},{key:'start',value:function start(){this._isRunning=true;setInterval(this.tick.bind(this),1000/_constants.GAME_TICK_RATE);_vendor.logger.info('session.start (session_id: '+this._id+')')} /**
   * Called each time this session is updated.
   */},{key:'tick',value:function tick(){var timeNow=undefined,timeElapsed=undefined;if(this._isRunning){timeNow=(0,_lodash.now)();timeElapsed=this._lastTickAt?timeNow-this._lastTickAt:0;this._store.dispatch((0,_game.advanceTime)(timeElapsed));this.update();this._lastTickAt=timeNow}} /**
   * Called each time this sessions should be updated.
   */},{key:'update',value:function update(){this.updateEntities()} /**
   * Ends this session.
   */},{key:'end',value:function end(){this._unsubscribeFromStore()} /**
   * Adds a player to this session.
   * @param {Object} props
   */},{key:'addPlayer',value:function addPlayer(props){this.dispatch((0,_game.addEntity)(props))} /**
   * Removes a player from this session.
   * @param {string} id
   */},{key:'removePlayer',value:function removePlayer(id){this.dispatch((0,_game.removeEntity)(id))} /**
   * Updates each entity in this session.
   */},{key:'updateEntities',value:function updateEntities(){var _this=this;var gameState=this.gameState;var removedEntityIds=this.getEntityIds();(0,_lodash.forEach)(gameState.entities,function(props){var entity=(0,_lodash.find)(_this._entities,function(e){return e.id===props.id}); // Create the entity if it does not exist.
if(!entity){entity=(0,_entity.createEntity)(_this,props);_this.addEntity(entity)}entity.update(props,_this._store.dispatch); // Remove updated entities from the list of entities to be removed.
removedEntityIds=removedEntityIds.filter(function(id){return id!==props.id})}); // Destroy entities that have been removed.
this.destroyEntities(removedEntityIds)} /**
   * Adds an entity to this session's entity pool.
   * @param {Entity} entity
   */},{key:'addEntity',value:function addEntity(entity){this._entities.push(entity)} /**
   * Returns a list containing the id of every entity in this session.
   * @returns {Array}
   */},{key:'getEntityIds',value:function getEntityIds(){var ids=[];(0,_lodash.forEach)(this._entities,function(entity){ids.push(entity.id)});return ids} /**
   * Destroys a set of entities from this session's entity pool.
   * @param {Array} ids
   */},{key:'destroyEntities',value:function destroyEntities(ids){this._entities=this._entities.filter(function(entity){var isRemoved=ids.indexOf(entity.id)!==-1;if(isRemoved){entity.destroy()}return!isRemoved})} /**
   * Called by clients to dispatch actions received from the browser.
   * @param {Object} action
   */},{key:'handleClientAction',value:function handleClientAction(action){this._store.dispatch(action)} /**
   * Called each time the state of this session changes.
   */},{key:'handleStateChange',value:function handleStateChange(){if(this._isRunning&&this.shouldSendState()){this._io.to(this.channel).emit('set_state',this.gameState,this._packetSequence++);this._lastSyncAt=(0,_lodash.now)()}} /**
   *
   * @returns {boolean}
   */},{key:'shouldSendState',value:function shouldSendState(){return !this._lastSyncAt||(0,_lodash.now)()-this._lastSyncAt>1000/_constants.GAME_SYNC_RATE} /**
   * Dispatches an action to the sessions store.
   * @param {Object} action
   */},{key:'dispatch',value:function dispatch(action){this._store.dispatch(action)} /**
   * Returns data for this game.
   * @param {string} key
   * @returns {*}
   */},{key:'getGameData',value:function getGameData(key){return (0,_lodash.get)(this._gameData,key)} /**
   * Returns the id of this session.
   * @returns {string}
   */},{key:'id',get:function get(){return this._id} /**
   * Returns the socket room for this session.
   * @returns {string}
   */},{key:'channel',get:function get(){return 'session/'+this._id} /**
   * Returns the game data for this session.
   * @returns {Object}
   */},{key:'gameData',get:function get(){return this._gameData} /**
   * Returns the current state of this session.
   * @returns {Object}
   */},{key:'gameState',get:function get(){return this._store.getState().game.toJS()}}]);return Session}();exports.default=Session;
//# sourceMappingURL=session.js.map