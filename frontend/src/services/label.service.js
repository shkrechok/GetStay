import { utilService } from "./util.service.js"

const STORAGE_KEY = 'labelsDB'

const demoLabels = [
    {
      "id": "l101",
      "name": "Rooms",
      "imgUrl": "Rooms"
    },
    {
      "id": "l102",
      "name": "Beachfront",
      "imgUrl": "Beachfront"
      
    },
    {
      "id": "l103",
      "name": "Amazing views",
      "imgUrl": "Amazing views"
    },
    {
      "id": "l104",
      "name": "Farms",
      "imgUrl": "Farms"
    },
    {
      "id": "l105",
      "name": "Castles",
      "imgUrl": "Castles"
    },
    {
      "id": "l106",
      "name": "Tropical",
      "imgUrl": "Tropical"
    },
    {
      "id": "l107",
      "name": "Lakefront",
      "imgUrl": "Lakefront"
    },
    {
      "id": "l108",
      "name": "OMG!",
      "imgUrl": "OMG"

    },
    {
      "id": "l109",
      "name": "Countryside",
        "imgUrl": "Countryside"
    },
    {
      "id": "l110",
      "name": "Cabins",
        "imgUrl": "Cabins"
    },
    {
      "id": "l111",
      "name": "Amazing pools",
        "imgUrl": "Amazing pools"
    },
    {
      "id": "l112",
      "name": "Chef`s kitchens",
        "imgUrl": "Chef`s kitchens"
    },
    {
      "id": "l113",
      "name": "Design",
        "imgUrl": "Design"
    }
  ]


  export const labelService = {
    query
}
_createLabels()

async function query() {
    // return httpService.get(BASE_URL)
    let labels = utilService.loadFromStorage(STORAGE_KEY)
    // console.log('labels', labels)
    return labels
}

function _createLabels() {
        let labels = utilService.loadFromStorage(STORAGE_KEY)
        if (!labels || !labels.length) {
            labels = demoLabels
            utilService.saveToStorage(STORAGE_KEY, labels)
        }
        return labels
    }