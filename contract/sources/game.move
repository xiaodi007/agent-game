/// Module: game
/// provides functions for performing random selection from a vector.
/// choice: Selects a single element from a given vector of elements.
/// choices: Selects multiple elements from a given vector of elements.

module xiaodi::game {
    // use sui::transfer;
    // use std::string;
    use sui::random;
    // use std::debug;
    use sui::random::{Random};

public struct Rands has key {
    id: UID,
    owner: address,
    worlds: vector<u8>,
    hp: u8,
    items: vector<u8>,
    turn_begin: vector<u8>,
    turn_item: vector<u8>,
    ai_random:u8,
    player_random:u8,
 }



fun choice<T: copy>(seq: &vector<T>, rng: &random::Random, ctx: &mut TxContext): T {
    // If the input vector is empty, abort the operation
    if (vector::is_empty(seq)) {
        abort 0
    };

    // Get the length of the vector
    let len = seq.length() as u64;

    // Initialize the random number generator
    let mut generator = random::new_generator(rng, ctx);

    // Generate a random index within the range of the vector's length
    let rand_index = random::generate_u64_in_range(&mut generator, 0, len - 1);

    // Return the element at the randomly selected index
    *vector::borrow(seq, rand_index)
}

fun choices<T: copy>(seq: &vector<T>, count: u64, rng: &random::Random, ctx: &mut TxContext): vector<T> {
    // If the input vector is empty, abort the operation
    if (vector::is_empty(seq)) {
        abort 0
    };

    // Get the length of the vector
    let len = seq.length() as u64;

    // Initialize the random number generator
    let mut generator = random::new_generator(rng, ctx);

    // Create an empty vector to store the results
    let mut results = vector::empty<T>();

    // Initialize a counter for the loop
    let mut i = 0;

    // Loop to select 'count' number of random elements
    while (i < count) {
        // Generate a random index within the range of the vector's length
        let rand_index = random::generate_u64_in_range(&mut generator, 0, len - 1);

        // Get the element at the randomly selected index
        let value = *vector::borrow(seq, rand_index);

        // Add the selected element to the results vector
        vector::push_back(&mut results, value);

        // Increment the counter
        i = i + 1;
    };

    // Return the vector of randomly selected elements
    results
}

entry fun rollDice(rng: &Random, ctx: &mut TxContext) {
    // Define vectors representing dice, worlds, world selection, hp, and items
    let dice = vector[1u8, 2u8, 3u8, 4u8, 5u8, 6u8];
    let worlds = vector[1u8, 2u8, 3u8, 4u8, 5u8, 6u8, 7u8, 8u8];
    let world = vector[0u8, 1u8];
    let hp = vector[2u8, 3u8, 4u8];
    // let hp = vector[1u8, 2u8, 3u8, 4u8];
    let item = vector[1u8, 2u8, 3u8, 4u8, 5u8];

    // Randomly select a number of worlds
    let worlds_num = xiaodi::game::choice(&worlds, rng, ctx);
    
    // Select a number of worlds based on the previously selected number
    let world_vec = xiaodi::game::choices(&world, worlds_num as u64, rng, ctx);
    
    // Randomly select a hp value
    let hps = xiaodi::game::choice(&hp, rng, ctx);
    
    // Randomly select 8 items
    let item_vec = xiaodi::game::choices(&item, 8u64, rng, ctx);
    
    // Randomly select 2 dice for the first play
    let first_play = xiaodi::game::choices(&dice, 2u64, rng, ctx);
    
    // Randomly select 2 dice for the first item
    let first_item = xiaodi::game::choices(&dice, 2u64, rng, ctx);
    
    // Initialize the random number generator
    let mut generator = random::new_generator(rng, ctx);
    
    // Generate a random number for the AI
    let ai_random = random::generate_u8(&mut generator);
    
    // Generate a random number for the player
    let player_random = random::generate_u8(&mut generator);

    // Transfer the created object
    transfer::share_object(
        Rands {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            worlds: world_vec,
            hp: hps,
            items: item_vec,
            turn_begin: first_play,
            turn_item: first_item,
            ai_random: ai_random,
            player_random: player_random,
        }
    )
}


#[test]
fun test_x() {
    use sui::test_scenario as ts;
    use std::string;

    let user0 = @0x0;
    let mut ts = ts::begin(user0);

    random::create_for_testing(ts.ctx());
    ts.next_tx(user0);
    let mut random_state: random::Random = ts.take_shared();

    let u8_vector = vector[10u8, 20u8, 30u8, 40u8, 50u8];

    let u8_weights = vector[1, 2, 3, 4, 5];

    let sigle_choice_u8 = randomX::randomX::choice(&u8_vector, &mut random_state, ts.ctx());
    debug::print(&sigle_choice_u8);

    let many_choice_u8 = randomX::randomX::choices(&u8_vector, 2, &mut random_state, ts.ctx());
    debug::print(&many_choice_u8);

    let choice_u8 = randomX::randomX::weighted_choice(&u8_vector, &u8_weights, &mut random_state, ts.ctx());
    debug::print(&choice_u8);

    let choices_u8 = randomX::randomX::weighted_choices(&u8_vector, &u8_weights, 2, &mut random_state, ts.ctx());
    debug::print(&choices_u8);

    ts::return_shared(random_state);
    ts.end();
}
}







