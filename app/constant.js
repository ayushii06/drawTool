import select from '../public/toolbar/select.svg'
import pen from '../public/toolbar/pen.svg'
import eraser from '../public/toolbar/eraser.svg'
import text from '../public/toolbar/text.svg'
import gallery from '../public/toolbar/gallery.svg'
import minus from '../public/toolbar/minus.svg'
import rectangle from '../public/toolbar/rectangle.svg'
import circle from '../public/toolbar/circle.svg'
import hand from '../public/toolbar/hand.svg'

const colors = {
    BLACK: '#1d1d1d',
    RED: '#e03131',
    GREEN: '#099268',
    BLUE: '#1971c2',
    ORANGE: '#f08c00',
    PURPLE:'#ae3ec9'
}

const fillColors = {
    BLACK: '#e9ecef',
    RED: '#ffc9c9',
    GREEN: '#b2f2bb',
    BLUE: '#a5d8ff',
    ORANGE: '#ffec99',
    PURPLE:'#eebefa'
}


const tools = {
    Move:'pan',
    Select : 'select',
    Pen : 'pen',
    Eraser : 'eraser',
    Rectangle : 'rectangle',
    Circle:'circle',
    Line : 'line',
    Text : 'text',
   
}

const icons = [
    { id: tools.Move, src: hand, alt: 'Move',url : '/'  },
    { id: tools.Select, src: select, alt: 'Select' , url : '/' },
    { id: tools.Pen, src: pen, alt: 'Pen' ,url : '/'  },
    { id: tools.Eraser, src: eraser, alt: 'Eraser',url : '/'  },
    { id: tools.Rectangle, src: rectangle, alt: 'Rectangle',url : '/'  },
    {id:tools.Circle,src:circle,alt:'Circle',url:'/'},
    { id: tools.Line, src: minus, alt: 'line' ,url : '/' },
    { id: tools.Text, src: text, alt: 'Text',url : '/'  },
];

const Backgrounds = {
    WHITE : '#ffffff',
    ORANGE : '#ffe7b3',
    BLUE : '#b4efff',
    GREEN : '#ceffb3',
    PURPLE : '#f3c4ff',
}

export {colors, fillColors, tools,icons,Backgrounds}