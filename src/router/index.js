import Vue from 'vue'
import VueRouter from 'vue-router'
import Requirements from '../views/Requirements.vue'
import Consent from '../views/Consent.vue'
import Survey from '../views/Survey.vue'
import GeneralInstructions from '../views/GeneralInstructions.vue'
import Preloader from '../views/Preloader.vue'
import Test from '../views/Test.vue'
import Training from '../views/Training.vue'
import End from '../views/End.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Requirements',
    component: Requirements
  },
  {
    path: '/consent',
    name: 'Consent',
    component: Consent
  },
  {
    path: '/survey',
    name: 'Survey',
    component: Survey
  },
  {
    path: '/generalInstructions',
    name: 'GeneralInstructions',
    component: GeneralInstructions
  },  
  {
    path: '/preloader',
    name: 'Preloader',
    component: Preloader
  },
  {
    path: '/training',
    name: 'Training',
    component: Training
  },
  {
    path: '/test',
    name: 'Test',
    component: Test
  },
  {
    path: '/end',
    name: 'End',
    component: End
  },
]

const router = new VueRouter({
  routes,
  scrollBehavior () {
    return { x: 0, y: 0 }
  }
  
})

export default router
