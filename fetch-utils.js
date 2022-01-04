const SUPABASE_URL = 'https://gxwgjhfyrlwiqakdeamc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjQxMTMxMiwiZXhwIjoxOTUxOTg3MzEyfQ.PHekiwfLxT73qQsLklp0QFEfNx9NlmkssJFDnlvNIcA';

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


export async function createCharacter(character){
    const newCharacter = {
        ...character, 
        user_id: client.auth.user().id, 
    };
    console.log(newCharacter);

    // use the newCharacter to create a single new character for this user in supabase
    const response = await client 
        .from(`characters`)
        .insert([
            {
                ...newCharacter
            }
        ]);
    return checkError(response);
}

export async function updateHead(newHead){
    const currentUserId = client.auth.user().id;

    // in supabase, update the head property
    // for the character whose user_id match's the currently logged in user's id
    const response = await client
        .from(`characters`)
        .update({ head: newHead })
        .match({ user_id: currentUserId })
        .single();
    
    // console.log(response);
    return checkError(response);    
}


export async function updateMiddle(newMiddle){
    const currentUserId = client.auth.user().id;

    // in supabase, update the middle property
    // for the character whose user_id match's the currently logged in user's id
    const response = await client
        .from(`characters`)
        .update({ middle: newMiddle })
        .match({ user_id: currentUserId })
        .single();

    return checkError(response);    
}


export async function updateBottom(newBottom){
    const currentUserId = client.auth.user().id;

    // in supabase, update the bottom property
    // for the character whose user_id match's the currently logged in user's id
    const response = await client
        .from(`characters`)
        .update({ bottom: newBottom })
        .match({ user_id: currentUserId })
        .single();

    return checkError(response);    
}

export async function updateCatchphrases(newCatchphrases){
    const currentUserId = client.auth.user().id;

    // in supabase, update the catchphrases property
    // for the character whose user_id match's the currently logged in user's id

    const response = await client
        .from(`characters`)
        .update({ catchphrases: newCatchphrases })
        .match({ user_id: currentUserId })
        .single();

    return checkError(response);    
}


/*
CHALLENGE: how would you use this function? which functions would it replace? what's going on with the brackets in the update() arguments?

export async function updateCharacter(part, value){
    const currentUserId = client.auth.user().id;

    const response = await client
        .from('characters')
        .update({ [part]: value })
        .match({ user_id: currentUserId });

    return checkError(response);    
}
*/


export async function fetchCharacter() {
    const response = await client
        .from('characters')
        .select()
        .match({ user_id: client.auth.user().id, })
        .single();

    return checkError(response);    
}

export async function getUser() {
    return client.auth.session();
}


export async function checkAuth() {
    const user = await getUser();

    if (!user) location.replace('../'); 
}

export async function redirectToBuild() {
    if (await getUser()) {
        location.replace('./character');
    }
}

export async function signupUser(email, password){
    const response = await client.auth.signUp({ email, password });
    
    return response.user;
}

export async function signInUser(email, password){
    const response = await client.auth.signIn({ email, password });

    return response.user;
}

export async function logout() {
    await client.auth.signOut();

    return window.location.href = '../';
}

function checkError({ data, error }) {
    return error ? console.error(error) : data;
}
