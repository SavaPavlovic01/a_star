class Heap {
    // The constructor method is called when a new instance of Heap is created.
    constructor(comparator) {
      // Initialize the heap array.
      this.heap = [];
  
      // Set the comparator method for comparing nodes in the heap.
      // If no comparator function is provided, it defaults to a comparison
      // function that sorts in ascending order (a min-heap).
      this.comparator = comparator || ((a, b) => a - b);
    }
  
    // Return the number of items in the heap.
    size() {
      return this.heap.length;
    }
  
    // Check if the heap is empty.
    isEmpty() {
      return this.size() == 0;
    }
  
    // Get the top element in the heap without removing it.
    // For a min-heap, this will be the smallest element;
    // for a max-heap, it will be the largest.
    peek() {
      return this.heap[0];
    }
  
    // Add a new value to the heap.
    insert(value) {
      // First, add the new value to the end of the array.
      this.heap.push(value);
  
      // Then, move the new value up the heap to its correct position.
      this.heapifyUp();
    }
  
    // Remove and return the top element in the heap.
    delete() {
      // If the heap is empty, just return null
      if (this.isEmpty()) {
        return null;
      }
      // Save the top element so we can return it later.
      const poppedValue = this.peek();
  
      // If there is more than one node in the heap, move the last node to the top.
      const bottom = this.size() - 1;
      if (bottom > 0) {
        this.swap(0, bottom);
      }
  
      // Remove the last node (which is now the top node) from the heap.
      this.heap.pop();
  
      // Move the new top node down the heap to its correct position.
      this.heapifyDown();
  
      // Finally, return the original top element.
      return poppedValue;
    }
  
    // Method to get the index of a node's parent.
    parentIndex(i) {
      /*
      About Math.floor:
      
      We take the floor value of the division to 
      make sure we get the nearest lower integer value. 
      This is important because array indexes
      are integer values and cannot have fractional parts.
      */
      return Math.floor((i - 1) / 2);
    }
  
    // Method to get the value of a node's parent.
    parentValue(i) {
      /*
     Check if the index is within the bounds of the heap and the parent exists. 
     If the index is less than the heap's size and the parent index is greater than or equal to 0, it means the parent exists. 
     If it doesn't exist or the index is out of bounds, we return undefined.
    */
      return i < this.size() && this.parentIndex(i) >= 0
        ? this.heap[this.parentIndex(i)]
        : undefined;
    }
  
    // Method to get the index of a node's left child.
    leftChildIndex(i) {
      return 2 * i + 1;
    }
  
    // Method to get the value of a node's left child.
    leftChildValue(i) {
      /*
     Check if the left child exists. 
     If the left child index is less than the size of the heap, it means the left child exists. 
     If it doesn't exist, we return undefined.
    */
      return this.hasLeftChild(i) ? this.heap[this.leftChildIndex(i)] : undefined;
    }
  
    // Method to check if a node has left child.
    // It returns true if the left child index is within the valid range of heap indexes, 
    // which indicates that a left child exists.
    hasLeftChild(i) {
      return this.leftChildIndex(i) < this.size();
    }
  
    // Method to get the index of a node's right child.
    rightChildIndex(i) {
      return 2 * i + 2;
    }
  
    // Method to get the value of a node's right child.
    rightChildValue(i) {
      /*
       Check if the right child exists. 
       If the right child index is less than the size of the heap, it means the right child exists. 
       If it doesn't exist, we return undefined.
      */
      return this.hasRightChild(i)
        ? this.heap[this.rightChildIndex(i)]
        : undefined;
    }
  
    // Method to check if a node has right child.
    // It returns true if the right child index is within the valid range of heap indexes, 
    // which indicates that a right child exists.
    hasRightChild(i) {
      return this.rightChildIndex(i) < this.size();
    }
  
    // Method to swap the values of two nodes in the heap.
    swap(i, j) {
      // Swap the values of elements at indices i and j without using a temporary variable:
      [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
  
    // This method is used to rearrange the heap after adding a new element.
    heapifyUp() {
      // We start from the last node in the heap. This is the node that was most recently added.
      let nodeIndex = this.size() - 1;
  
      /*
      In the while loop, we swap the values to maintain the heap property.
      When? If the following 2 conditions are true:
      
      - "nodeIndex > 0": 
        This means we haven't reached to the main parent yet.
        
      - "this.comparator(parentNodeValue, currentNodeValue) > 0":
        If this is true, it means the heap property is violated and we need to swap values.
        "comparator" function here compares if the current node is smaller or bigger than it's parent. 
        Based on the heap order, comparator function will be slightly different. Such as:
          ((a, b) => (a - b) for min heap
          ((a, b) => (b - a) for max heap
      */
  
      while (
        // The node is not the root (it has a parent).
        nodeIndex > 0 &&
        this.comparator(this.parentValue(nodeIndex), this.heap[nodeIndex]) > 0
      ) {
        // The heap property is violated for our node and its parent. We need to swap them to restore the heap property.
        this.swap(nodeIndex, this.parentIndex(nodeIndex));
  
        // After swapping, our node has moved one level up the heap. We update nodeIndex to the index of the parent.
        // In the next iteration of the loop, we'll check the heap property for the node and its new parent.
        nodeIndex = this.parentIndex(nodeIndex);
      }
    }
  
    // Method to move a node down the heap until it is in the correct position.
    // Used after a deletion
    heapifyDown() {
      // We start from the top node in the heap which is the root, always at index 0.
      // So we initialize the current node index at 0.
      let currNodeIndex = 0;
  
      // The 'while' loop continues as long as the current node has a left child.
      // The reason for this is that a heap is a complete binary tree and hence,
      // a node would have a left child before it has a right child.
      while (this.hasLeftChild(currNodeIndex)) {
        // Assume the smaller child is the left one.
        let smallerChildIndex = this.leftChildIndex(currNodeIndex);
  
        /*
        Check if there's a right child and compare it to the left child.
        If the right child is smaller, update the smallerChildIndex to the right child's index
        Based on the heap order, comparator function will be slightly different. Such as:
          ((a, b) => (a - b) for min heap
          ((a, b) => (b - a) for max heap
        */
        if (
          this.hasRightChild(currNodeIndex) &&
          this.comparator(
            this.rightChildValue(currNodeIndex),
            this.leftChildValue(currNodeIndex)
          ) < 0
        ) {
          smallerChildIndex = this.rightChildIndex(currNodeIndex);
        }
  
        // If the current node is smaller or equal to its smaller child, then it's already in correct place.
        // This means the heap property is maintained, so we break the loop.
        if (
          this.comparator(
            this.heap[currNodeIndex],
            this.heap[smallerChildIndex]
          ) <= 0
        ) {
          break;
        }
  
        // If the current node is not in its correct place (i.e., it's larger than its smaller child),
        // then we swap the current node and its smaller child.
        this.swap(currNodeIndex, smallerChildIndex);
  
        // After swapping, the current node moves down to the position of its smaller child.
        // Update the current node index to the smaller child's index for the next iteration of the loop.
        currNodeIndex = smallerChildIndex;
      }
    }
  
    // Displays an array that will represent the heap as a binary tree
    // in level-order, with each sub-array representing a level of the tree.
    // such as: [ [ 1 ], [ 5, 3 ], [ 9, 6, 8 ] ]
    displayHeap() {
      let result = [];
      let levelCount = 1; // Counter for how many elements should be on the current level.
      let currentLevel = []; // Temporary storage for elements on the current level.
  
      for (let i = 0; i < this.size(); i++) {
        currentLevel.push(this.heap[i]);
  
        // If the current level is full (based on levelCount), add it to the result and reset currentLevel.
        if (currentLevel.length === levelCount) {
          result.push(currentLevel);
          currentLevel = [];
          levelCount *= 2; // The number of elements on each level doubles as we move down the tree.
        }
      }
  
      // If there are any elements remaining in currentLevel after exiting the loop, add them to the result.
      if (currentLevel.length > 0) {
        result.push(currentLevel);
      }
  
      return result;
    }
  }
  
  class MinHeap extends Heap {
    constructor() {
      super((a, b) => a[0] - b[0]); // MinHeap uses a comparator that sorts in ascending order
    }
  }
  
  class MaxHeap extends Heap {
    constructor() {
      super((a, b) => b - a); // MaxHeap uses a comparator that sorts in descending order
    }
  }





var cell_width = 50;
var cell_height = 50;

var context;
var canvas;

var width;
var height;

const map = new Map();

const start = (cell_width * 5).toString() + "|" + (cell_height * 5)

const end = (cell_width * 10).toString() + "|" + (cell_height * 10)

function draw_line(xS, yS, xE,yE){
    context.beginPath()
    context.moveTo(xS,yS)
    context.lineTo(xE, yE)
    context.stroke()
}

function mouse_down(ev){
    const rect = canvas.getBoundingClientRect();
    let x = ev.clientX - rect.left;
    let y = ev.clientY - rect.top;

    let real_x = Math.floor(x / cell_width) * cell_width
    let real_y = Math.floor(y / cell_height) * cell_height
    let index = real_x.toString() + "|" + real_y

    if(index === start) return
    if(index === end) return

    if (map.has(index)){
        map.delete(index)
    } else {
        map.set(index , 1)
    }

    redraw()
}

function redraw(){
    context.clearRect(0, 0, width, height)
    draw_lines()
    draw_scene()
}

function color_square(style, x, y){
    context.fillStyle = style;
    context.fillRect(x, y, cell_width, cell_height)
}

function draw_lines(){
    context.strokeStyle = "black"
    for(let i = 0 + cell_width; i <= width; i += cell_width ){
        draw_line(i, 0, i, height)
    }

    for(let i = 0 + cell_height; i <= height; i += cell_height ){
        draw_line(0, i, width, i)
    }
}

function draw_scene(){
    let start_tuple = start.split("|")
    color_square("red", start_tuple[0], start_tuple[1])

    let end_tuple = end.split("|")
    color_square("green", end_tuple[0], end_tuple[1])

    for(let [key, val] of map){
        let tuple = key.split("|")
        if(val == 1) color_square("gray", tuple[0], tuple[1]);
        if(val == 2) color_square("blue", tuple[0], tuple[1]);
        if(val == 3) color_square("yellow", tuple[0], tuple[1]);
    }
}

function get_neighbors(x, y){
    let neighbors = []
    if(x > 0){
        if(!map.has((x - cell_width).toString() + "|" + y)){
            neighbors.push([x - cell_width, y])
        }  
    }
    if(x < width - cell_width){
        if(!map.has((x + cell_width).toString() + "|" + y)){
            neighbors.push([x + cell_width, y])
        }
    }
    if(y > 0){
        if(!map.has(x.toString() + "|" + (y - cell_height))){
            neighbors.push([x, y - cell_height])
        }
    }
    if( y < height - cell_height){
        if(!map.has(x.toString() + "|" +  (y + cell_height))){
            neighbors.push([x, y + cell_height])
        }
    }
    return neighbors
}

function menhatan(x, y){
    let end_tuple = end.split("|");
    let cur_x = Math.floor(x / cell_width)
    let cur_y = Math.floor(y / cell_height)

    let end_x = Math.floor(end_tuple[0] / cell_width)
    let end_y = Math.floor(end_tuple[1] / cell_height)
    return Math.abs(cur_x - end_x) + Math.abs(cur_y - end_y)
}

function pos_to_str(x,y){
    return x.toString() + "|" + y
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 0 ukupna cena
// 1 broj koraka
// 2 trenutna pos
// 3 cela putanja
async function a_star(){
    
    let heap = new MinHeap()
    let cur_tuple = start.split("|")
    get_neighbors(parseInt(cur_tuple[0]),parseInt(cur_tuple[1])).forEach((element)=> 
        heap.insert([1 + menhatan(element[0], element[1]), 1, element ,pos_to_str(element[0], element[1])]))
    //console.log(heap.displayHeap())
    map.set(start, 10)
    while(!heap.isEmpty()){
        let cur_node = heap.delete();
        if(pos_to_str(cur_node[2][0], cur_node[2][1]) === end){
            let nodes = cur_node[3].split(",")
            for(let node of nodes){
                if(node === end) continue;
                map.set(node, 3)
                redraw()
                await sleep(50)
            }
            redraw()
            return
        }
        
        if (map.has(pos_to_str(cur_node[2][0], cur_node[2][1]))) continue;
        map.set(pos_to_str(cur_node[2][0],cur_node[2][1]), 2)
        //console.log(cur_node[2])
        get_neighbors(cur_node[2][0], cur_node[2][1]).forEach((element)=> 
            heap.insert([cur_node[1] + menhatan(element[0], element[1]),
             cur_node[1] + 1, element ,cur_node[3] + "," + (pos_to_str(element[0], element[1]))]))
        redraw()
        await sleep(50)
    }
}



function init(){
    canvas = document.getElementById("canvas");
    width = Math.floor(window.innerWidth / cell_width) * cell_width;
    height = Math.floor(window.innerHeight / cell_height) * cell_height;
    canvas.width = width;
    canvas.height = height;
    context = canvas.getContext("2d");
    context.strokeStyle = "black"

    redraw()

    canvas.addEventListener("mousedown", mouse_down)
}



window.onload = () => {
    init();  
};