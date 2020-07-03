// Storage Controller

const StorageCtrl = (function () {
  // Public Methods
  return {
    storeItem: function (item) {
      let items
      // check if any items in ls
      if (localStorage.getItem('items') === null) {
        items = []
        // Push the new item
        items.push(item)

        // set ls
        localStorage.setItem('items', JSON.stringify(items))
      } else {
        items = JSON.parse(localStorage.getItem('items'))

        // Push the new item
        items.push(item)

        // reset ls
        localStorage.setItem('items', JSON.stringify(items))
      }
    },
    getItemsFromStorage: function () {
      let items
      if (localStorage.getItem('items') === null) {
        items = []
      } else {
        items = JSON.parse(localStorage.getItem('items'))
      }
      return items
    },
    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'))

      items.forEach(function (item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem)
        }
      })
      localStorage.setItem('items', JSON.stringify(items))
    },
    deleteItemFromStorage: function (id) {
      let items = JSON.parse(localStorage.getItem('items'))

      items.forEach(function (item, index) {
        if (id === item.id) {
          items.splice(index, 1)
        }
      })
      localStorage.setItem('items', JSON.stringify(items))
    },
    clearItemsFromStorage: function () {
      localStorage.removeItem('items')
    }
  }
})()

// Item Controller
const ItemCtrl = (function () {
  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = id
    this.name = name
    this.calories = calories
  }

  // Data Structure / State
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  // Public Methods
  return {
    getItems: function () {
      return data.items
    },
    addItem: function (name, calories) {
      let ID
      // Create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1
      } else {
        ID = 0
      }

      // Calories to number
      calories = parseInt(calories)

      // Create new item
      newItem = new Item(ID, name, calories)

      // Add to items array
      data.items.push(newItem)

      return newItem
    },
    getItemById: function (id) {
      let found = null
      // loopThrough Items
      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item
        }
      })
      return found
    },
    updateItem: function (name, calories) {
      // calories to number
      calories = parseInt(calories)
      let found = null

      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = name
          item.calories = calories
          found = item
        }
      })
      return found
    },
    deleteItem: function (id) {
      // get the ids
      const ids = data.items.map(function (item) {
        return item.id
      })

      // get the index
      const index = ids.indexOf(id)

      // Remove Item
      data.items.splice(index, 1)
    },
    clearAllItems: function () {
      data.items = []
    },
    setCurrentItem: function (item) {
      data.currentItem = item
    },
    getCurrentItem: function () {
      return data.currentItem
    },
    getTotalCalories: function () {
      let total = 0
      // Loop through items and get total calories
      data.items.forEach(function (item) {
        total += item.calories
      })
      // set total cal in data structure
      data.totalCalories = total

      return data.totalCalories
    },
    logData: function () {
      return data
    }
  }
})()

// UI Controller
const UICtrl = (function () {
  // UISelectors
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }
  // Public Methods
  return {
    populateItemList: function (items) {
      let html = ''

      items.forEach(function (item) {
        html += `
        <li id="item-${item.id}" class="collection-item">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
        </li>
        `
      })

      // Inset list items
      document.querySelector(UISelectors.itemList).innerHTML = html
    },
    getItemInput () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem: function (item) {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block'
      // Create element
      const li = document.createElement('li')
      // Add Class
      li.className = 'collection-item'
      // Add the id
      li.id = `item-${item.id}`

      // Add the html
      li.innerHTML = `
      <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
          `

      // Inser item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement('beforeend', li)
    },
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems)

      // Turn Node list into array
      listItems = Array.from(listItems)

      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute('id')
        if (itemID === `item-${item.id}`) {
          document.querySelector(
            `#${itemID}`
          ).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`
        }
      })
    },
    deleteListItem: function (id) {
      const itemID = `#item-${id}`
      const item = document.querySelector(itemID)
      item.remove()
    },
    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = ''
      document.querySelector(UISelectors.itemCaloriesInput).value = ''
    },
    addItemToForm: function () {
      document.querySelector(
        UISelectors.itemNameInput
      ).value = ItemCtrl.getCurrentItem().name
      document.querySelector(
        UISelectors.itemCaloriesInput
      ).value = ItemCtrl.getCurrentItem().calories
      UICtrl.showEditState()
    },
    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems)
      // Turn Node list in array
      listItems = Array.from(listItems)

      listItems.forEach(function (item) {
        item.remove()
      })
    },
    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none'
    },
    showTotalCalories: function (totalCalories) {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories
    },
    clearEditState: function () {
      UICtrl.clearInput()
      document.querySelector(UISelectors.updateBtn).style.display = 'none'
      document.querySelector(UISelectors.deleteBtn).style.display = 'none'
      document.querySelector(UISelectors.backBtn).style.display = 'none'
      document.querySelector(UISelectors.addBtn).style.display = 'inline'
    },
    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline'
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline'
      document.querySelector(UISelectors.backBtn).style.display = 'inline'
      document.querySelector(UISelectors.addBtn).style.display = 'none'
    },
    getSelectors: function () {
      return UISelectors
    }
  }
})()

// App Controller
const App = (function (ItemCtrl, UICtrl, StorageCtrl) {
  // Load Event Listeners
  const loadEventListeners = function () {
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors()

    // Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener('click', itemAddSubmit)

    // Disable submit on enter

    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault()
        return false
      }
    })

    // Edit item click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener('click', itemEditClick)

    // Update Item event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener('click', itemUpdateSubmit)

    // Delete Item event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener('click', itemDeleteSubmit)

    // Back button event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener('click', UICtrl.clearEditState)

    // Clear Items Event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener('click', clearAllItemsClick)
  }

  // Add item submit
  const itemAddSubmit = function (e) {
    // Get Form Input from UI controller
    const input = UICtrl.getItemInput()

    // check for name and calories input
    if (input.name !== '' && input.calories !== '') {
      // Add Item
      const newItem = ItemCtrl.addItem(input.name, input.calories)
      // Add newItem to UI
      UICtrl.addListItem(newItem)

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories()

      // Add Total calories to ui
      UICtrl.showTotalCalories(totalCalories)

      // Store in LocalStorage
      StorageCtrl.storeItem(newItem)

      // Clear Field
      UICtrl.clearInput()
    }

    e.preventDefault()
  }

  // item edit
  const itemEditClick = function (e) {
    if (e.target.classList.contains('edit-item')) {
      // get the list item id
      const listId = e.target.parentNode.parentNode.id

      // Break into an array
      const listIdArr = listId.split('-')
      // Get the actual id
      const id = parseInt(listIdArr[1])

      // Get Item
      const itemToEdit = ItemCtrl.getItemById(id)

      // set current item
      ItemCtrl.setCurrentItem(itemToEdit)

      // Add Item to form
      UICtrl.addItemToForm()
    }

    e.preventDefault()
  }

  // Item update submit
  const itemUpdateSubmit = function (e) {
    // Get Item input
    const input = UICtrl.getItemInput()

    // Update Item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories)

    // Update ui item
    UICtrl.updateListItem(updatedItem)

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories()

    // Add Total calories to ui
    UICtrl.showTotalCalories(totalCalories)

    // Update local Storage
    StorageCtrl.updateItemStorage(updatedItem)

    // Clear State
    UICtrl.clearEditState()

    e.preventDefault()
  }

  // Item delete submit
  const itemDeleteSubmit = function (e) {
    // Get current item

    const currentItem = ItemCtrl.getCurrentItem()

    // Delete from data Sructure
    ItemCtrl.deleteItem(currentItem.id)

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id)

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories()

    // Add Total calories to ui
    UICtrl.showTotalCalories(totalCalories)

    // Delete from localstorage
    StorageCtrl.deleteItemFromStorage(currentItem.id)

    // Clear State
    UICtrl.clearEditState()

    e.preventDefault()
  }

  // Clear All Event
  const clearAllItemsClick = function (e) {
    // Delete all items from data structure
    ItemCtrl.clearAllItems()

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories()

    // Add Total calories to ui
    UICtrl.showTotalCalories(totalCalories)

    // Remove from UI
    UICtrl.removeItems()
    // Clear from LocalStorage
    StorageCtrl.clearItemsFromStorage()

    // hide ul
    UICtrl.hideList()
  }

  // Public Methods
  return {
    init: function () {
      // Clear Edit State / Set Initial State
      UICtrl.clearEditState()

      console.log('Initializing App...')
      // Fetch Items from data structure
      const items = ItemCtrl.getItems()

      // check if any item
      if (items.length === 0) {
        UICtrl.hideList()
      } else {
        // populate list with items
        UICtrl.populateItemList(items)
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories()

      // Add Total calories to ui
      UICtrl.showTotalCalories(totalCalories)

      // call load event listener
      loadEventListeners()
    }
  }
})(ItemCtrl, UICtrl, StorageCtrl)

App.init()
