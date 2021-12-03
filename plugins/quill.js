import Quill from "quill";
// import { ImageResize } from "quill-image-resize-module";

// Quill.register("modules/imageResize", ImageResize);

import Vue from 'vue';
import VueQuillEditor from 'vue-quill-editor';

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// mount with global
Vue.use(VueQuillEditor)



