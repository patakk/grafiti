var particles_info = {
    count: 4000000,
    speed: .1,
    input: "hello",
    colors: true,
  };
  
var realFrameCount = 0;
var frameCount = fxrand()*10000.;
var webgl_context;
var notholding = false;
var canvas;
var text_canvas;
var count_prev = particles_info.count;
var speed_prev = particles_info.speed;
var prev_origin = [-1000, -1000];
var input_image;
var gr;
var input_image_tex;

var resx = 3300;
var resy = 4300;
var colors_current = 1.0*particles_info.colors;
var colors_target = colors_current;

var time0 = 0;
var time1 = 0;


var palettes = [
  'b3001b-255c99-ccad8f',
  'd8dcff-aeadf0-c38d94-a76571-565676',
  '562c2c-f2542d-f5dfbb-0e9594-127475',
  '33658a-2f4858-f6ae2d-f26419',
  'ff0000-ff8200-ffc100-ffeaae',
  '5f0f40-9a031e-fb8b24-e36414-0f4c5c',
  '839788-eee0cb-baa898-bfd7ea',
  'f4d06f-ff8811-9dd9d2-fff8f0-392f5a',
  'eaf2e3-61e8e1-f25757-f2e863-f2cd60',
]
function fxrandom(a, b){
    return a + fxrand()*(b-a);
}
function shuffle(array) {
    let currentIndex = array.length
    var randomIndex;

  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(fxrand() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16)/255.,
    parseInt(result[2], 16)/255.,
    parseInt(result[3], 16)/255.
  ] : null;
}
for(var k = 0; k < palettes.length; k++){
  let text = palettes[k];
  let cols = text.split('-')
  let caca = [];
  cols.forEach((e)=>{caca.push(hexToRgb(e))});
  shuffle(caca)
  var coco = [];
  caca.forEach((e, i)=>{coco.push([(caca[i][0]+fxrandom(-.2, .2)), (caca[i][1]+fxrandom(-.2, .2)), (caca[i][2]+fxrandom(-.2, .2))])});
  palettes[k] = coco;
}

let textGen = function(p) {
  let x = 0;
  let y = 0;

  p.setup = function() {
    p.createCanvas(512, 512*resy/resx);
    p.reset("ABC");
  };

  p.draw = function() {
    //if(p.mouseIsPressed)
      //p.ellipse(p.mouseX, p.mouseY, 14, 14);
  };
  p.reset = function(txtinput){
    let pal = palettes[Math.floor(fxrand()*30)];
   pal = palettes[30];
    txtinput = txtinput.toUpperCase();
    let bg = pal[Math.floor(fxrand()*pal.length)];
    p.background(bg[0]*33,bg[1]*33,bg[2]*33);
    p.background(0);
    p.randomSeed(Math.round(fxrand()*100000));
    p.noiseSeed(Math.round(fxrand()*100000));
    p.fill(255);
    p.noStroke();
    p.rectMode(p.CENTER);
    p.textSize(44);


    p.rectMode(p.CENTER);
    for(var k = 0; k < 155; k++){
      col = pal[Math.floor(fxrand()*pal.length)];
      p.fill(255);
      p.fill(col[0]*255,col[1]*255,col[2]*255);
      p.push();
      p.translate(p.random(0, p.width), p.random(0, p.height));
      //p.rotateX(p.random(100));
      //p.rotateY(p.random(100));
       p.rotate(p.random(-1.9,1.9)*0+p.radians(33 + 90*k));
      // p.rect(0, 0, p.random(122, 133), p.random(5, 44));
      // p.ellipse(0, 0, 6, 233);
      let ro = fxrand();
      p.ellipse(0, 0, 10+100*ro, 10+100*ro);
      p.fill(ro*255,ro*255,ro*255);
      p.translate(p.random(-20, 20), p.random(-20,20))
      // p.rect(0, 0, 22, 22);
      p.pop();
    }
    p.fill(255);
    p.push();
    p.translate(128, 128);
    p.rotate(p.random(-p.PI/4,p.PI/4));
    for(var kk = 0; kk < 10; kk++){
        p.fill(255 - 14*kk);
        //p.ellipse(0, 0, 16-kk*1.4, 177);
    }
    p.pop();
  }

};

let myp5 = new p5(textGen);

function isMobile() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

function toDataURL(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      callback(reader.result);
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}


var getSourceSynch = function(url) {
    var req = new XMLHttpRequest();
    req.open("GET", url, false);
    req.send(null);
    return (req.status == 200) ? req.responseText : null;
  }; 

function createShader(gl, shader_info) {
    var shader = gl.createShader(shader_info.type);
    var i = 0;
    //var shader_source = document.getElementById(shader_info.name).text;
    /* skip whitespace to avoid glsl compiler complaining about
      #version not being on the first line*/
    //while (/\s/.test(shader_source[i])) i++; 
    //shader_source = shader_source.slice(i);
    shader_source = shader_info.name;
    gl.shaderSource(shader, getSourceSynch(shader_source));
    gl.compileShader(shader);
    var compile_status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compile_status) {
      var error_message = gl.getShaderInfoLog(shader);
      throw "Could not compile shader \"" +
            shader_info.name +
            "\" \n" +
            error_message;
    }
    return shader;
}


/* Creates an OpenGL program object.
   `gl' shall be a WebGL 2 context.
   `shader_list' shall be a list of objects, each of which have a `name'
      and `type' properties. `name' will be used to locate the script tag
      from which to load the shader. `type' shall indicate shader type (i. e.
      gl.FRAGMENT_SHADER, gl.VERTEX_SHADER, etc.)
  `transform_feedback_varyings' shall be a list of varying that need to be
    captured into a transform feedback buffer.*/
function createGLProgram(gl, shader_list, transform_feedback_varyings) {
  var program = gl.createProgram();
  for (var i = 0; i < shader_list.length; i++) {
    var shader_info = shader_list[i];
    var shader = createShader(gl, shader_info);
    gl.attachShader(program, shader);
  }

  /* Specify varyings that we want to be captured in the transform
     feedback buffer. */
  if (transform_feedback_varyings != null) {
    gl.transformFeedbackVaryings(program,
                                 transform_feedback_varyings,
                                 gl.INTERLEAVED_ATTRIBS);
  }
  gl.linkProgram(program);
  var link_status = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!link_status) {
    var error_message = gl.getProgramInfoLog(program);
    throw "Could not link program.\n" + error_message;
  }
  return program;
}

function randomRGData(size_x, size_y) {
  var d = [];
  for (var i = 0; i < size_x * size_y; ++i) {
    d.push(fxrand() * 255.0);
    d.push(fxrand() * 255.0);
  }
  return new Uint8Array(d);
}


function map(x, v1, v2, v3, v4){
  return (x-v1)/(v2-v1)*(v4-v3)+v3;
}

function getb(c){
  //return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  return Math.sqrt( 0.299*c[0]*c[0] + 0.587*c[1]*c[1] + 0.114*c[2]*c[2] )
}

function ssorted(array){

  let narray = [];
  for(let k = 0; k < array.length; k++){
    narray.push(array[k]);
  }

  for(let j = 0; j < narray.length; j++){
      for(let i = 0; i < narray.length; i++){
          if(getb(narray[i]) > getb(narray[j])){
              [narray[i], narray[j]] = [narray[j], narray[i]];
          }
      }
  }

  let nnarray = [];
  for(let k = 0; k < Math.min(narray.length, 24); k++){
    nnarray.push(narray[k]);
  }
  
  return nnarray;
}

function initialParticleData(num_parts) {
  


  var data = [];

  let palette = palettes[3];
  for (var i = 0; i < num_parts; ++i) {


    // pos
    let x = map(fxrand(), 0, 1, .03, -.03+1)*resx;
    let y = map(fxrand(), 0, 1, .03, -.03+1)*resy;
    data.push(x);
    data.push(y);

    // age
    data.push(0);

    // seed
    // // opacity
    data.push(fxrand());
    // // drag
    data.push(fxrand());
    
    // color
    let colorIndex = power(noise(x*0.001, y*0.01), 3) * palette.length + -2+fxrand()*4;
    let col = palette[Math.floor(colorIndex+palette.length)%palette.length];
    data.push(0*col[0]+0*.1*(-.5+fxrand()));
    data.push(0*col[1]+0*.1*(-.5+fxrand()));
    data.push(0*col[2]+0*.1*(-.5+fxrand()));

    // vel
    data.push(0.0);
    data.push(0.0);
  }
  return data;
}

function setupParticleBufferVAO(gl, buffers, vao) {
  gl.bindVertexArray(vao);
  for (var i = 0; i < buffers.length; i++) {
    var buffer = buffers[i];
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer_object);
    var offset = 0;
    for (var attrib_name in buffer.attribs) {
      if (buffer.attribs.hasOwnProperty(attrib_name)) {
        var attrib_desc = buffer.attribs[attrib_name];
        gl.enableVertexAttribArray(attrib_desc.location);
        gl.vertexAttribPointer(
          attrib_desc.location,
          attrib_desc.num_components,
          attrib_desc.type,
          false, 
          buffer.stride,
          offset);
        var type_size = 4; /* we're only dealing with types of 4 byte size in this demo, unhardcode if necessary */
        offset += attrib_desc.num_components * type_size; 
        if (attrib_desc.hasOwnProperty("divisor")) {
          gl.vertexAttribDivisor(attrib_desc.location, attrib_desc.divisor);
        }
      }
    }
  }
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

function init(
    gl,
    num_particles,
    ) {
  var update_program = createGLProgram(
    gl,
    [
      {name: "assets/shaders/compute.vert", type: gl.VERTEX_SHADER},
      {name: "assets/shaders/compute.frag", type: gl.FRAGMENT_SHADER},
    ],
    [
      "v_Position",
      "v_Age",
      "v_Seed",
      "v_Color",
      "v_Velocity",
    ]);
  var render_program = createGLProgram(
    gl,
    [
      {name: "assets/shaders/shading.vert", type: gl.VERTEX_SHADER},
      {name: "assets/shaders/shading.frag", type: gl.FRAGMENT_SHADER},
    ],
    null);
  var update_attrib_locations = {
    i_Position: {
      location: gl.getAttribLocation(update_program, "i_Position"),
      num_components: 2,
      type: gl.FLOAT
    },
    i_Age: {
      location: gl.getAttribLocation(update_program, "i_Age"),
      num_components: 1,
      type: gl.FLOAT
    },
    i_Seed: {
      location: gl.getAttribLocation(update_program, "i_Seed"),
      num_components: 2,
      type: gl.FLOAT
    },
    i_Color: {
      location: gl.getAttribLocation(update_program, "i_Color"),
      num_components: 3,
      type: gl.FLOAT
    },
    i_Velocity: {
      location: gl.getAttribLocation(update_program, "i_Velocity"),
      num_components: 2,
      type: gl.FLOAT
    }
  };
  var render_attrib_locations = {
    i_Position: {
      location: gl.getAttribLocation(render_program, "i_Position"),
      num_components: 2,
      type: gl.FLOAT
    },
    i_Age: {
      location: gl.getAttribLocation(render_program, "i_Age"),
      num_components: 1,
      type: gl.FLOAT
    },
    i_Seed: {
      location: gl.getAttribLocation(render_program, "i_Seed"),
      num_components: 2,
      type: gl.FLOAT
    },
    i_Color: {
      location: gl.getAttribLocation(render_program, "i_Color"),
      num_components: 3,
      type: gl.FLOAT
    }
  };
  var vaos = [
    gl.createVertexArray(),
    gl.createVertexArray(),
    gl.createVertexArray(),
    gl.createVertexArray()
  ];
  var buffers = [
    gl.createBuffer(),
    gl.createBuffer(),
  ];
var vao_desc = [
    {
      vao: vaos[0],
      buffers: [{
        buffer_object: buffers[0],
        stride: 4 * 10,
        attribs: update_attrib_locations
      }]
    },
    {
      vao: vaos[1],
      buffers: [{
        buffer_object: buffers[1],
        stride: 4 * 10,
        attribs: update_attrib_locations
      }]
    },
    {
      vao: vaos[2],
      buffers: [{
        buffer_object: buffers[0],
        stride: 4 * 10,
        attribs: render_attrib_locations
      }],
    },
    {
      vao: vaos[3],
      buffers: [{
        buffer_object: buffers[1],
        stride: 4 * 10,
        attribs: render_attrib_locations
      }],
    },
  ];
  var initial_data = new Float32Array(initialParticleData(num_particles));
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers[0]);
  gl.bufferData(gl.ARRAY_BUFFER, initial_data, gl.STREAM_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers[1]);
  gl.bufferData(gl.ARRAY_BUFFER, initial_data, gl.STREAM_DRAW);
  for (var i = 0; i < vao_desc.length; i++) {
    setupParticleBufferVAO(gl, vao_desc[i].buffers, vao_desc[i].vao);
  }

  // gl.clearColor(0.0, 0.0, 0.0, 1.0);
  var rg_noise_texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, rg_noise_texture);
  gl.texImage2D(gl.TEXTURE_2D, 0,  gl.RG8, 512, 512*resy/resx, 0, gl.RG, gl.UNSIGNED_BYTE, randomRGData(512, 512*resy/resx));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  
  input_image_tex = gl.createTexture();
  input_image.src = myp5._renderer.canvas.toDataURL("image/png");
  input_image.onload = function (){
    gl.bindTexture(gl.TEXTURE_2D, input_image_tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 512, 512*resy/resx, 0, gl.RGBA, gl.UNSIGNED_BYTE, input_image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  }
    
  var particle_opacity = 0.16;
  if(num_particles < 500000)
    particle_opacity = 0.16 + (0.7-0.16)*(1. - (num_particles-50000)/(500000-50000));

  return {
    particle_sys_buffers: buffers,
    particle_sys_vaos: vaos,
    read: 0,
    write: 1,
    particle_update_program: update_program,
    particle_render_program: render_program,
    num_particles: initial_data.length / 10,
    old_timestamp: 0.0,
    rg_noise: rg_noise_texture,
    total_time: 0.0,
    born_particles: initial_data.length / 10,
    origin: [-1000.0, -1000.0],
    input_image: input_image_tex,
    particle_opacity: particle_opacity,
  };
}

var count=1;
function render(gl, state, timestamp_millis) {
  //if(count%120==0){
  //  console.log(Math.round(1.*count/(performance.now()-time0)*1000.));
  //}
  count++;
  //input_image.src = './assets/fingerprint.png';
    
  frameCount = frameCount + 1.0;

  var num_part = state.born_particles;
  var time_delta = 0.0;
  if (state.old_timestamp != 0) {
    time_delta = timestamp_millis - state.old_timestamp;
    if (time_delta > 500.0) {
      time_delta = 0.0;
    }
  }
  if (state.born_particles < state.num_particles) {
    state.born_particles = Math.min(state.num_particles,
                    Math.floor(state.born_particles + state.birth_rate * time_delta));
  }
  state.old_timestamp = timestamp_millis;
  if(realFrameCount == 0 || true){
    gl.clearColor(.8, .8, .8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }
  gl.useProgram(state.particle_update_program);
  gl.uniform1f(
    gl.getUniformLocation(state.particle_update_program, "u_Time"),
    frameCount);
  gl.uniform1f(
      gl.getUniformLocation(state.particle_update_program, "u_Speed"),
      speed_prev);
  gl.uniform1f(
    gl.getUniformLocation(state.particle_update_program, "u_TotalTime"),
    state.total_time);
  gl.uniform2f(
    gl.getUniformLocation(state.particle_update_program, "u_Origin"),
    state.origin[0],
    state.origin[1]);
  var aang = fxrandom(-3.1415, 3.1415)*114;
  var ddr = fxrandom(15, 15)*4;
  var ddx = ddr*Math.cos(aang);
  var ddy = ddr*Math.sin(aang);
  gl.uniform2f(gl.getUniformLocation(state.particle_update_program, "u_Resolution"), resx, resy);
  state.total_time += time_delta;
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, state.input_image);
  // gl.uniform1i(
  //   gl.getUniformLocation(state.particle_update_program, "u_InputImage"),
  //   0);

  // 
  gl.bindVertexArray(state.particle_sys_vaos[state.read]);
  gl.bindBufferBase(
    gl.TRANSFORM_FEEDBACK_BUFFER, 0, state.particle_sys_buffers[state.write]);
  gl.enable(gl.RASTERIZER_DISCARD);
  gl.beginTransformFeedback(gl.POINTS);
  gl.drawArrays(gl.POINTS, 0, num_part);
  gl.endTransformFeedback();
  gl.disable(gl.RASTERIZER_DISCARD);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
  gl.bindVertexArray(state.particle_sys_vaos[state.read + 2]);
  gl.useProgram(state.particle_render_program);
  gl.viewport(0, 0,
    gl.drawingBufferWidth, gl.drawingBufferHeight);
  // Set the clear color to darkish green.
  var br = .74 - .6*colors_current;
  br = .04;
  //gl.clearColor(br, br, br, 1.0);
  // Clear the context with the newly set color. This is
  // the function call that actually does the drawing.
  //gl.clear(gl.COLOR_BUFFER_BIT);
  
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  
  gl.uniform2f( gl.getUniformLocation(state.particle_render_program, "u_Resolution"), resx, resy);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, state.input_image);
  // gl.uniform1i(
  //   gl.getUniformLocation(state.particle_update_program, "u_InputImage"),
  // 0);
  gl.uniform1f(
    gl.getUniformLocation(state.particle_render_program, "u_Colors"),
    colors_current);
  gl.uniform1f(
    gl.getUniformLocation(state.particle_render_program, "u_Opacity"),
    state.particle_opacity);
  gl.uniform3f(
    gl.getUniformLocation(state.particle_render_program, "u_Tint1"),
    0,0,0);
  gl.uniform3f(
    gl.getUniformLocation(state.particle_render_program, "u_Tint2"),
    0,0,0);

  var tmp = state.read;
  state.read = state.write;
  state.write = tmp;

  var pc = particles_info["count"];
  // if(count_prev != pc && notholding){
  //   count_prev = pc;
  //   state = resetState();
  // }
  // if(speed_prev != particles_info.speed){
  //   speed_prev = particles_info.speed;
  //   console.log("???")
  // }
  realFrameCount++;
  //gl.drawArrays(gl.POINTS, 0, num_part);
  if(realFrameCount < 1344){
    window.requestAnimationFrame(function(ts) { render(gl, state, ts); });
    if((realFrameCount+1)%1 == 0){
      console.log("hello")
      gl.drawArrays(gl.POINTS, 0, num_part);
    }
  }
  else{
    console.log("hello render")
    gl.drawArrays(gl.POINTS, 0, num_part);
  }


  colors_current = colors_current + (colors_target - colors_current)*.12;
}


function reportWindowSize() {
    repositionCanvas(canvas)
}

function save(){
  const dataURL = canvas.toDataURL('image/png');
  // Create an <a> element with download attribute and click it programmatically to download the PNG file
  const link = document.createElement('a');
  link.download = 'render_' + fxhash + '.png';
  link.href = dataURL;
  link.click();
}

// javascript implementation of keypressed
document.addEventListener('keydown', (event) => {
  const keyName = event.key;
  if(keyName == 's'){
    save();
  }
});

function repositionCanvas(canvas){
    var win = window,
    doc = document,
    body = doc.getElementsByTagName('body')[0],
    ww = win.innerWidth || canvas.clientWidth || body.clientWidth,
    hh = win.innerHeight|| canvas.clientHeight|| body.clientHeight;
    
    mm = Math.min(ww, hh);

    win.onresize = reportWindowSize;
    if(isMobile()){
      canvas.width = resx;
      canvas.height = resy;
      canvas.style.borderWidth = "0px";
    }
    else{
      canvas.width = resx;
      canvas.height = resy;
      canvas.style.borderWidth = "0px";
    }

    let oom = ww/hh;
    let com = resx/resy;
    let sw = 100;
    let sh = 100;
    if(oom > com){
      sh = hh;
      sw = sh*com;
    }
    else{
      sw = ww;
      sh = sw/com;
    }

    canvas.style.position = 'absolute';
    canvas.style.width = sw + "px";
    canvas.style.height = sh + "px";
    canvas.style.left = ww/2 - sw/2 + 'px';
    canvas.style.top = hh/2 - sh/2 + 'px';

    
}

function resetState(){
  
  //time0 = performance.now();
  document.onmousemove = function(e) {
    var x = e.pageX - canvas.offsetLeft;
    var y = e.pageY - canvas.offsetTop;
    x = x / parseInt(canvas.style.width) * resx;
    y = y / parseInt(canvas.style.height) * resy;
    if(!isMobile()) state.origin = [x, y];
    
  };
  
  canvas.ontouchmove = function(e) {
    var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
    var touch = evt.touches[0] || evt.changedTouches[0];
    var x = touch.pageX - this.offsetLeft;
    var y = touch.pageY - this.offsetTop;
    state.origin = [x, y];
  };
  
  canvas.ontouchend = function(e) {
    if(isMobile()){
      state.origin = [-1000, -1000];
    }
  };

  var state =
  init(
    webgl_context,
    count_prev,
  );
  return state;
}

function preventBehavior(e) {
  e.preventDefault(); 
};

function displayMessage(){
  const message = document.createElement("div");
  const l1 = document.createElement("div");
  const l2 = document.createElement("div");
  const l3 = document.createElement("img");

  var win = window,
  doc = document,
  body = doc.getElementsByTagName('body')[0],
  ww = win.innerWidth || canvas.clientWidth || body.clientWidth,
  hh = win.innerHeight|| canvas.clientHeight|| body.clientHeight;

  l1.innerHTML = "mobile devices not supported";
  l2.innerHTML = "here's an image";
  l3.src = "./assets/sample.png";
  l3.style.width = ww*0.8 + "px";
  
  l3.style.borderStyle = "solid";
  l3.style.borderWidth = "10px";
  l3.style.borderColor = "#b4b4b4";
  message.appendChild(l1);
  message.appendChild(document.createElement("br"));
  message.appendChild(l2);
  message.appendChild(document.createElement("br"));
  message.appendChild(document.createElement("br"));
  message.appendChild(l3);
  document.body.prepend(message);

  message.style.position = 'absolute';
  message.style.textAlign = 'center';
  message.style.white_space = 'pre';
  message.style.left = ww/2 - l1.offsetWidth/2 + 'px';
  message.style.top = hh/2 - ww*0.8*.73 + 'px';

}

function main() {
    document.addEventListener("touchmove", preventBehavior, {passive: false});
   
    if(isMobile()){
      //displayMessage();
      return;
    }
    canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;
    repositionCanvas(canvas);
    
    window.addEventListener('mousedown', function() {
      notholding = false;
    });
    window.addEventListener('mouseup', function() {
      notholding = true;
    });
    window.addEventListener('touchstart', function() {
      notholding = false;
    });
    window.addEventListener('touchend', function() {
      notholding = true;
    });
    
    webgl_context = canvas.getContext("webgl2", {preserveDrawingBuffer: true});
    if (webgl_context != null) {
      document.body.prepend(canvas);
        input_image = new Image();
        input_image.src = myp5._renderer.canvas.toDataURL("image/png");
        //input_image.src = './assets/fingerprint.png';
        
        input_image.onload = function (){
          var state = resetState();
          window.requestAnimationFrame(function(ts) { render(webgl_context, state, ts); });
        }
    }
    else {
      document.write("WebGL2 is not supported by your browser");
    }
}

window.onload = function(e){ 
  main();
}






let palettesstrings = [
  'f3db53-f19ba6-a08a7f-d50a15-3c71ec-f3dd56-d40b16-3c6cf0-f19ba6-a08a7f', 
   'f46036-5b85aa-414770-372248-f55d3e-878e88-f7cb15-76bed0-9cfffa-acf39d-b0c592-a97c73-af3e4d',
   '121212-F05454-30475E-F5F5F5-F39189-BB8082-6E7582-046582',
   '084c61-db504a-e3b505-4f6d7a-56a3a6-177e89-084c61-db3a34-ffc857-323031',
   '32373b-4a5859-f4d6cc-f4b860-c83e4d-de6b48-e5b181-f4b9b2-daedbd-7dbbc3',
   'fa8334-fffd77-ffe882-388697-54405f-ffbc42-df1129-bf2d16-218380-73d2de',
   '3e5641-a24936-d36135-282b28-83bca9-ed6a5a-f4f1bb-9bc1bc-e6ebe0-36c9c6',
   'dc3000-83250b-45070a-59565d-fa6302',
   '33658a-86bbd8-758e4f-f6ae2d-f26419',
    'fe5d26-f2c078-faedca-c1dbb3-7ebc89-3d5a80-98c1d9-e0fbfc-ee6c4d-293241',
    'f3db53-f19ba6-a08a7f-d50a15-3c71ec-f3dd56-d40b16-3c6cf0-f19ba6-a08a7f', 
    'f46036-5b85aa-414770-372248-f55d3e-878e88-f7cb15-76bed0-9cfffa-acf39d-b0c592-a97c73-af3e4d',
   '084c61-db504a-e3b505-4f6d7a-56a3a6-177e89-084c61-db3a34-ffc857-323031',
];
palettesstrings = [
  'd50a15-3c71ec-f3dd56-a08a7f',
  '372248-414770-b0c592-76bed0-a97c73-af3e4d-878e88-9cfffa-f46036-5b85aa-f7cb15-acf39d-f55d3e',
  'F5F5F5-6E7582-F39189-046582-30475E-F05454-121212-BB8082',
  '084c61-4f6d7a-56a3a6-ffc857-db504a-177e89-db3a34-e3b505-323031',
  'c83e4d-de6b48-32373b-f4d6cc-4a5859-f4b9b2-daedbd-7dbbc3-e5b181-f4b860',
  '218380-73d2de-54405f-fa8334-bf2d16-388697-ffbc42-df1129-ffe882-fffd77',
  'a24936-282b28-36c9c6-3e5641-9bc1bc-ed6a5a-83bca9-f4f1bb-e6ebe0-d36135',
  '304d7d-dc758f-db995a-00ffcd-fdc300-bbbbbb-664c43-e3d3e4-222222-873d48',
  'f2c14e-45f0df-f78154-8789c0-c2cae8-8380b6-4d9078-111d4a-5fad56-b4431c',
  'E71414-FACB79-B25068-12947F-Ff4828-4C3A51-2FC4B2-dddddd-774360-F17808',
  'f5f5f5-3c3c3c-087e8b-ff5a5f-c1839f-ff2222-816797-51557E-1B2430-D6D5A8',
  '9145B6-4C3F61-F9D923-C98B70-36AE7C-65799B-FF5677-B958A5-187498-EB5353-368E7C-394359',
  '90be6d-43aa8b-577590-277da1-f3722c-4d908e-99e2b4-f9844a-f8961e-f94144-f9c74f-99d4e2',
  '58a4b0-373f51-1b1b1e-d8dbe2-fdca40-df2935-3772ff-080708-e6e8e6-a9bcd0',
  'ee9b00-9b2226-bb3e03-e9d8a6-ca6702-0a9396-94d2bd-005f73-ae2012',
  'fb8b24-e36414-5f0f40-0f4c5c-9a031e',
  'e76f51-f4a261-2a9d8f-264653-e9c46a',
  '74c69d-d8f3dc-95d5b2-2d6a4f-1b4332-081c15-52b788-b7e4c7-40916c',
  'd00000-f48c06-dc2f02-9d0208-6a040f-ffba08-03071e-faa307-e85d04-370617',
  '1a1423-eacdc2-372549-774c60-b75d69',
  '00b0fa-bf1f2e-297d45-383b36-26408f',
  '1655c9-93a8cf-6f8695-e3980e-e6b967-1c448e-d6cdc7-f505a5',
  'dad6d6-220001-6b020a-89010c-f7f4f3-00858f-47030a-1f1f1f-7e030e-0a0a0a',
  '81a4cd-054a91-f17300-dbe4ee-3e7cb1',
  '2f4550-f4f4f9-000000-586f7c-b8dbd9',
  '5c5552-59a96a-8b85c1-ef3054-42cafd',
  'c91b18-cfcdd6-788a91-090427-373f43',
  '45070a-dc3000-fa6302-59565d-83250b',
  'f95738-ee964b-0d3b66-772e25-283d3b-edddd4-197278-faf0ca-f4d35e-c44536',
  '3d5a80-c1dbb3-e0fbfc-7ebc89-faedca-f2c078-ee6c4d-293241-98c1d9-fe5d26',
  'b26e63-084c61-d9fff8-dc758f-00ffcd-73d2de-56a3a6-1f3c36-f4c7a4-664c43-714c04-83bca9-bf2d16-b84527-d36135-282b28-c4f4c7-c83e4d-c8e0f4-d2a467-4f6d7a-3e5641-654c4f-88beb6-e3d3e4-9dd1f1-e8e1ef-9bb291-ffbc42-952709-e3b505-ba1200-218380-32373b-4e2649-9da9a0-cec075-f4d6cc-508aa8-975341-39160e-873d48-a24936-c7ffda-e2af51-c0caad-031927-4a5859-db504a-f4b860-df1129',
];

function power(p, g) {
  if (p < 0.5)
      return 0.5 * Math.pow(2*p, g);
  else
      return 1 - 0.5 * Math.pow(2*(1 - p), g);
}

// palettesstrings = [
//     ['#324FA6','#478c77','#FC4426','#A3AC3F'],
// ]


// for(let k = 0; k < palettesstrings.length; k++){
//     palettesstrings[k] = palettesstrings[k].join('-').replace(/#/g, '');
// }

var palettes = [];
palettesstrings.forEach(element => {
 palettes.push(element);
});


function hexToRgb(hex) {
 var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
 return result
     ? [
         parseInt(result[1], 16) / 255.,
         parseInt(result[2], 16) / 255.,
         parseInt(result[3], 16) / 255.
     ]
     : null;
}

function shuffle(array) {
  let currentIndex = array.length
  var randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(fxrand() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [
          array[currentIndex], array[randomIndex]
      ] = [
          array[randomIndex], array[currentIndex]
      ];
  }

  return array;
}

for (var k = 0; k < palettes.length; k++) {
  let text = palettes[k];
  let cols = text.split('-')
  let caca = [];
  cols.forEach((e) => {
      caca.push(hexToRgb(e))
  });
  // shuffle(caca)
  caca = ssorted(caca)
  var coco = [];
  caca.forEach((e, i) => {
      coco.push([
          (caca[i][0] + .1* map(fxrand(), 0, 1, -.2, .2)),
          (caca[i][1] + .1* map(fxrand(), 0, 1, -.2, .2)),
          (caca[i][2] + .1* map(fxrand(), 0, 1, -.2, .2))
      ])
  });
  palettes[k] = coco;
}



const PERLIN_YWRAPB = 4;
const PERLIN_YWRAP = 1 << PERLIN_YWRAPB;
const PERLIN_ZWRAPB = 8;
const PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB;
const PERLIN_SIZE = 4095;

let perlin_octaves = 4; 
let perlin_amp_falloff = 0.5; 

const scaled_cosine = i => 0.5 * (1.0 - Math.cos(i * Math.PI));
let perlin;


var noise = function(x, y = 0, z = 0) {
  if (perlin == null) {
    perlin = new Array(PERLIN_SIZE + 1);
    for (let i = 0; i < PERLIN_SIZE + 1; i++) {
      perlin[i] = fxrand();
    }
  }

  if (x < 0) {
    x = -x;
  }
  if (y < 0) {
    y = -y;
  }
  if (z < 0) {
    z = -z;
  }

  let xi = Math.floor(x),
    yi = Math.floor(y),
    zi = Math.floor(z);
  let xf = x - xi;
  let yf = y - yi;
  let zf = z - zi;
  let rxf, ryf;

  let r = 0;
  let ampl = 0.5;

  let n1, n2, n3;

  for (let o = 0; o < perlin_octaves; o++) {
    let of = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB);

    rxf = scaled_cosine(xf);
    ryf = scaled_cosine(yf);

    n1 = perlin[of & PERLIN_SIZE];
    n1 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n1);
    n2 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
    n2 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2);
    n1 += ryf * (n2 - n1);

    of += PERLIN_ZWRAP;
    n2 = perlin[of & PERLIN_SIZE];
    n2 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n2);
    n3 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
    n3 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n3);
    n2 += ryf * (n3 - n2);

    n1 += scaled_cosine(zf) * (n2 - n1);

    r += n1 * ampl;
    ampl *= perlin_amp_falloff;
    xi <<= 1;
    xf *= 2;
    yi <<= 1;
    yf *= 2;
    zi <<= 1;
    zf *= 2;

    if (xf >= 1.0) {
      xi++;
      xf--;
    }
    if (yf >= 1.0) {
      yi++;
      yf--;
    }
    if (zf >= 1.0) {
      zi++;
      zf--;
    }
  }
  return r;
};

var noiseDetail = function(lod, falloff) {
  if (lod > 0) {
    perlin_octaves = lod;
  }
  if (falloff > 0) {
    perlin_amp_falloff = falloff;
  }
};

var noiseSeed = function(seed) {
  const lcg = (() => {
    const m = 4294967296;
    const a = 1664525;
    const c = 1013904223;
    let seed, z;
    return {
      setSeed(val) {
        z = seed = (val == null ? fxrand() * m : val) >>> 0;
      },
      getSeed() {
        return seed;
      },
      rand() {
        z = (a * z + c) % m;
        return z / m;
      }
    };
  })();

  lcg.setSeed(seed);
  perlin = new Array(PERLIN_SIZE + 1);
  for (let i = 0; i < PERLIN_SIZE + 1; i++) {
    perlin[i] = lcg.rand();
  }
};