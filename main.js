import * as _ from 'loadsh'

const component = () => {
  const Element = document.createElement('npdiv');
  Element = _.join('hellowword')
  return Element
}

const a = [1, 2, 4].map(item => {
  return item * 2
})
console.log(a)
document.body.append(component())