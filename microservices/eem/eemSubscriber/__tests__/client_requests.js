const { default: axios } = require('axios');
const ClientHelper = require('../dashboard/clientHelper');

let example_response = {"status":"success","docs":
    [{"type":"vegan","image":"sprout.svg","name":"Pure Kitchen",
      "menu":
        [{"item":"Radical Cauliflour Wings","price":16.5},{"item":"Thrive Bowl","price":17.5},{"item":"Warrior Bowl","price":21},{"item":"Artisinal Sandwich","price":18.75}],
      "kitchenId":"acd45280-4e12-4b97-865c-a44396d905c8"},
     {"type":"vegan","image":"sprout.svg","name":"Chipotle",
      "menu":
        [{"item":"Burrito","price":11},{"item":"Tacos","price":11.5},{"item":"Salad","price":12}],
      "kitchenId":"2c1be047-6b1f-4312-80e3-975966ae70d3"}
    ]
}

describe("Test Client requests", () => {
    global.fetch = jest.fn(() => {
        return Promise.resolve({
            json: () => Promise.resolve(example_response)
        })
    })
    test("Get Restaurants should return lists of restaurants", async () => {
        let response = await ClientHelper.getRestaurants(0);
        expect(response).toEqual(example_response.docs)
    });
    test("Get Restaurants failed to return lists of restaurants", async () => {
        example_response = {status: "processing"}
        let response = await ClientHelper.getRestaurants(0);
        expect(response).toEqual("Failed to get restaurants list in 10 tries")
    });
});
