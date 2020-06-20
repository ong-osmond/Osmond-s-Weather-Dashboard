## Welcome to my Weather Dashboard application.

You can find the application here: https://ong-osmond.github.io/Osmond-s-Weather-Dashboard/.

![Index Page](/assets/Osmond-s-Weather%20Dashboard.png)

## Features and How To Use the Application:

1. Enter a city name and click on the search icon to begin displaying the weather for a city. An alert will display if the city name is invalid.

2. The application connects to the openweathermap API to search for the city's current weather and five-day forecast (the number of days to forecast is configurable in the javascript file).

3. The centre of the page will display the city's current weather. The UV index colour will change depending on its value. 

For UVI <= 5: yellow for  "moderate";  
    UVI 6-  7: orange for "high"; 
    UVI 8-10: red for "very high"; 
    UVI 11: violet for "extreme".

4. The right-hand side of the page will display the five-day forecast for that city.

5. Search History: the cities you enter will be saved on the left-hand side of the page. Click on each city to display the weather info for that city. A maximum of five cities are saved at a time (in local storage; the number of cities is also configurable in the javascript file). Click on Clear History to remove all saved cities.

