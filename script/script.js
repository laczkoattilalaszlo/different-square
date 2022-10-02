window.onload = () => {

    ///////////////////
    /// VARIABLE(S) ///
    ///////////////////

    // Game adjustment values:
    const zoom = "75%";
    const round_counts_of_levels = [4, 4, 4, 4, 4, 5, 6, 7, 9, 10, 7, 4, 1, 1, 1, 1, 1, 1, 1, 1];
    const table_sizes_by_levels = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
    const base_visibility = 10; // Set higher to make the game easier, set lower to make th game harder.
    const base_time = 15;

    // Calculated values from adjustment:
    const visibility_decrease_value = base_visibility / round_counts_of_levels.length;
    const all_round = create_all_round(round_counts_of_levels, table_sizes_by_levels);

    // Values changing by the game flow:
    let visibility = base_visibility;
    let init_size = 2;
    let actual_match = [0, 0];
    let point = 0;
    let time_left = base_time;


    ///////////////////
    /// FUNCTION(S) ///
    ///////////////////

    // Creates an array containing all the rounds of all the levels in a row.
    function create_all_round(round_counts_of_levels, table_sizes_by_levels) {
        let all_round = [];
        for (let i = 0; i < round_counts_of_levels.length; i++) {
            let round = [];
            for (let j = 0; j < round_counts_of_levels[i]; j++) {
                round.push(table_sizes_by_levels[i]);
            }
            all_round.push(round);
        }
        return all_round;
    }


    // Displays the initial values. It DOES NOT set back the initial values, you have to do it before using this function!
    function display_initial_values() {
        const time_value = document.querySelector('#time_value');
        const point_value = document.querySelector('#point_value');
        const visibility_value = document.querySelector('#visibility_value');
        const level_value = document.querySelector('#level_value');
        const round_value = document.querySelector('#round_value');
        time_value.textContent = `${base_time}`;
        point_value.textContent = `${point}`;
        visibility_value.textContent = `${visibility}/${base_visibility}`;
        level_value.textContent = `1/${round_counts_of_levels.length}`;
        round_value.textContent = `1/${all_round[actual_match[0]].length}`;
    }


    // Calculates where is the position of the next match in the all_round array.
    function calculate_next_match(all_round, actual_match) {
        let next_match = [];
        if (all_round[all_round.length - 1] == actual_match[0] && all_round[all_round.length - 1].length - 1 == actual_match[1]) {
            return null;
        } else if (all_round[actual_match[0]].length - 1 != actual_match[1]) {
            next_match.push(actual_match[0]);
            next_match.push(actual_match[1] + 1);
            return next_match;
        } else {
            next_match.push(actual_match[0] + 1);
            next_match.push(0);
            return next_match;
        }
    }


    // Draws the table in the given size, with the given colors and handles its events.
    function draw_table(size) {
        // Arrange the square element in the game box:
        let board_length = size ** 2;
        let divide_ratio = Math.round((100 / size) * 10000) / 10000;
        let different_element_position = Math.floor(Math.random() * Math.floor(board_length));
        let element_color = create_normal_element_color();
        let different_elements_color = create_different_element_color(element_color, visibility);
        for (let i = 0; i < board_length; i++) {
            const game_box = document.querySelector('#game_box');
            if (i != different_element_position) {
                let content_normal = `<div class="game_square game_square_normal"></div>`;
                game_box.insertAdjacentHTML('beforeend', content_normal);
            } else {
                let content_different = '<div class="game_square" id="game_square_different"></div>';
                game_box.insertAdjacentHTML('beforeend', content_different);
            }
        }

        // Add size and color properties to the squares (normal, different):
        const game_square_all_elements = document.querySelectorAll('.game_square_normal');
        for (let element of game_square_all_elements) {
            element.setAttribute('style', `width:${divide_ratio}%; height:${divide_ratio}%; background-color:hsl(${element_color['hue']}, ${element_color['saturation']}%, ${element_color['lightness']}%`);
        }
        const game_square_different = document.querySelector('#game_square_different');
        game_square_different.setAttribute('style', `width:${divide_ratio}%; height:${divide_ratio}%; background-color:hsl(${different_elements_color['hue']}, ${different_elements_color['saturation']}%, ${different_elements_color['lightness']}%`);

        // Determine what happens when click on normal square:
        const game_square_normal_elements = document.querySelectorAll('.game_square_normal');
        game_square_normal_elements.forEach(item => {
            item.addEventListener('click', event => {
                set_point('decrease');
            })
        })
        // Determine what happens when click on different square:
        const level_value = document.querySelector('#level_value');
        const round_value = document.querySelector('#round_value');
        const visibility_value = document.querySelector('#visibility_value');
        game_square_different.addEventListener('click', function () {
            time_left = 0;
            delete_table();
            set_point('increase');
            let next_match = calculate_next_match(all_round, actual_match);
            visibility = base_visibility - (next_match[0] * visibility_decrease_value);
            let size = all_round[next_match[0]][next_match[1]];
            draw_table(size);
            time_left = base_time;
            actual_match = next_match;
            // Display level and round information
            level_value.textContent = `${actual_match[0] + 1}/${round_counts_of_levels.length}`;
            round_value.textContent = `${actual_match[1] + 1}/${all_round[actual_match[0]].length}`;
            visibility_value.textContent = `${visibility}/${base_visibility}`;
        });
        // Determine what happens when click on Restart button:
        const restart_button = document.querySelector('#restart_button');
        restart_button.addEventListener('click', function () {
            time_left = 0;
            delete_table();
            time_left = base_time;
            point = 0;
            visibility = base_visibility;
            actual_match = [0, 0];
            const point_value = document.querySelector('#point_value');
            const visibility_value = document.querySelector('#visibility_value');
            const level_value = document.querySelector('#level_value');
            const round_value = document.querySelector('#round_value');
            point_value.textContent = `${point}`;
            visibility_value.textContent = `${visibility}/${base_visibility}`;
            level_value.textContent = `${actual_match[0] + 1}/${round_counts_of_levels.length}`;
            round_value.textContent = `${actual_match[1] + 1}/${all_round[actual_match[0]].length}`;
            draw_table(init_size);
        });
    }


    // Deletes the content of the table.
    function delete_table() {
        const game_box = document.querySelector('#game_box');
        game_box.textContent = '';
    }


    // Gives the random colorization to the cards.
    function create_normal_element_color() {
        let hue = Math.floor(Math.random() * (361 - 0) + 0);
        let saturation = Math.floor(Math.random() * (101 - 30) + 30);
        let lightness = Math.floor(Math.random() * (81 - 50) + 50);
        return {"hue": hue, "saturation": saturation, "lightness": lightness};
    }


    // Creates the different element color from th create_normal_element_color() return value.
    function create_different_element_color(original_color_properties, visibility) {
        let random_choose_upper_or_down_difference = Math.random();
        let base_color = {...original_color_properties}
        //lightness
        if (random_choose_upper_or_down_difference < 0.5) {
            // Upper
            base_color['lightness'] = Math.ceil(original_color_properties['lightness'] + visibility);
            return base_color;
        } else {
            // Down
            base_color['lightness'] = Math.floor(original_color_properties['lightness'] - visibility);
            return base_color;
        }
    }


    // Increases or decreases the points.
    function set_point(direction) {
        if (direction == 'increase') {
            point++;
        } else if (direction == 'decrease' && point != 0) {
            point--;
        }
        const point_value = document.querySelector('#point_value');
        point_value.textContent = `${point}`;
    }


    // Starts the timer.
    function start_timer() {
        let countdown = document.querySelector(`#time_value`);
        let game_timer = setInterval(function () {
            if (time_left <= 0) {
                clearInterval(game_timer);
                countdown.textContent = `0`;
                const game_box = document.querySelector('#game_box');
                game_box.setAttribute('id', 'game_over')
                game_box.innerHTML = '<div>GAME OVER</div>';
                const restart_button = document.querySelector('#restart_button');
                restart_button.addEventListener('click', function () {
                    const game_over = document.querySelector('#game_over');
                    game_over.setAttribute('id', 'game_box')
                    delete_table();
                    time_left = base_time;
                    point = 0;
                    visibility = base_visibility;
                    actual_match = [0, 0];
                    display_initial_values();
                    draw_table(init_size);
                    start_timer(base_time);
                    log_values();
                });
            } else {
                countdown.textContent = `${time_left}`;
            }
            time_left -= 1;
        }, 1000);
    }


    // Logs the details of the different game values. (For debugging.)
    function log_values() {
        console.log(`
        Time left: ${time_left}
        Point: ${point}
        Visibility: ${visibility}
        Level: ${actual_match[0]}
        Round: ${actual_match[1]}
        `);
    }


    // Starts the game.
    function startGame() {
        // Adjust zoom level
        document.body.style.zoom = zoom;

        // Base value display
        display_initial_values();

        // Welcome screen
        const game_box = document.querySelector('#game_box');
        game_box.setAttribute('id', 'game_welcome_box');
        game_welcome_box = document.querySelector('#game_welcome_box');
        let content_game_welcome_box = `<div>PRESS PLAY</div>`;
        game_welcome_box.innerHTML = content_game_welcome_box;

        // Determine what happens when click on Play button
        const restart_button = document.querySelector('#restart_button')
        restart_button.remove();
        const play_button = document.querySelector('#play_button');
        play_button.addEventListener('click', function () {
            // Transform #game_welcome_box to #game_box
            game_welcome_box.children[0].remove();
            game_welcome_box.setAttribute('id', 'game_box');
            // Change Play button to Restart button
            play_button.remove();
            let content_game_box_footer = `<button id="restart_button"><img id="restart_button_image" src="image/restart.png"></button>`;
            let game_box_footer = document.querySelector('.game_box_footer')
            game_box_footer.insertAdjacentHTML('afterbegin', content_game_box_footer);
            // Start the game
            draw_table(init_size);
            start_timer(base_time);
            log_values();
        });

        // Determine what happens when click on Audio button
        let audio_button = document.querySelector('#audio_button');
        let audio = document.querySelector('#audio');
        audio_button.addEventListener('click', () => audio.paused ? audio.play() : audio.pause());
    }


    ////////////////////////
    /// FUNCTION CALL(S) ///
    ////////////////////////

    startGame();

}