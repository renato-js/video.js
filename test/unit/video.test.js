import videojs from '../../src/js/video.js';
import TestHelpers from './test-helpers.js';
import Player from '../../src/js/player.js';
import Options from '../../src/js/options.js';
import document from 'global/document';

q.module('video.js');

test('should create a video tag and have access children in old IE', function(){
  var fixture = document.getElementById('qunit-fixture');

  fixture.innerHTML += '<video id="test_vid_id"><source type="video/mp4"></video>';

  var vid = document.getElementById('test_vid_id');

  ok(vid.childNodes.length === 1);
  ok(vid.childNodes[0].getAttribute('type') === 'video/mp4');
});

test('should return a video player instance', function(){
  var fixture = document.getElementById('qunit-fixture');
  fixture.innerHTML += '<video id="test_vid_id"></video><video id="test_vid_id2"></video>';

  var player = videojs('test_vid_id');
  ok(player, 'created player from tag');
  ok(player.id() === 'test_vid_id');
  ok(Player.players['test_vid_id'] === player, 'added player to global reference');

  var playerAgain = videojs('test_vid_id');
  ok(player === playerAgain, 'did not create a second player from same tag');

  var tag2 = document.getElementById('test_vid_id2');
  var player2 = videojs(tag2);
  ok(player2.id() === 'test_vid_id2', 'created player from element');
});

test('should add the value to the languages object', function() {
  var code, data, result;

  code = 'es';
  data = {'Hello': 'Hola'};
  result = videojs.addLanguage(code, data);

  ok(Options['languages'][code], 'should exist');
  equal(Options['languages'][code], data, 'should match');
  deepEqual(result[code], Options['languages'][code], 'should also match');
});


test('should expose plugin registry function', function() {
  var pluginName, pluginFunction, player;

  pluginName = 'foo';
  pluginFunction = function(options) {
    console.log(this);
  };

  ok(videojs.plugin, 'should exist');

  videojs.plugin(pluginName, pluginFunction);

  player = TestHelpers.makePlayer();

  ok(player.foo, 'should exist');
  equal(player.foo, pluginFunction, 'should be equal');
});
