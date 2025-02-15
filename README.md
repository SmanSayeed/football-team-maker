# Football Team Maker Project

## Links
- [GitHub Repository](https://github.com/SmanSayeed/football-team-maker)
- [Live Application](https://football-team-maker.vercel.app)
- [Submodule GitHub Repository](https://github.com/SmanSayeed/football-team-maker-submodule)
- [API](https://rapidapi.com/tipsters/api/transfermarkt-db)

## Tools
- React JS
- Redux Toolkit
- RTK Query
- Lodash
- Material UI

## Description
In this application, users can filter and search football players:
- View football players in a responsive card grid view.
- Infinite scroll is applied; initially, 20 players are shown.
- Filter players by country, club, market value, and age.
- Create a team by selecting players' positions in a visual field view.
- Select teams with an age range between 25-27 years.
- Users cannot select players from more than 2 countries.
- The budget for making a team is between 300M-700M.
- Add or remove players from the positions view.

## Installation Process
1. Clone the repository from GitHub:
    ```sh
    git clone https://github.com/SmanSayeed/football-team-maker.git
    ```
2. Navigate to the project directory:
    ```sh
    cd football-team-maker
    ```
3. Initialize and update the submodule:
    ```sh
    git submodule update --init --recursive
    ```
4. Ensure the submodule is placed inside the `src` folder:
    ```sh
    mv football-team-maker-submodule src/
    ```
5. Install the project dependencies:
    ```sh
    npm install
    ```
6. Start the development server:
    ```sh
    npm start
    ```
