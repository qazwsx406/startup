
async function handleResponse(response) {
    if (!response.ok) {
        const errorText = await response.text();
        let errorData = {};
        try {
            errorData = JSON.parse(errorText);
        } catch (e) {
            errorData.msg = errorText || `HTTP error! status: ${response.status}`;
        }
        throw new Error(errorData.msg || `HTTP error! status: ${response.status}`);
    }
    if (response.status === 204) {
        return null;
    }
    return response.json();
}

export async function login(email, password) {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
}

export async function signup(email, password) {
    const response = await fetch('/api/auth/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
}

export async function logout() {
    const response = await fetch('/api/auth/logout', {
        method: 'DELETE',
    });
    return handleResponse(response);
}

export async function getCurrentUser() {
    const response = await fetch('/api/user/me');
    return handleResponse(response);
}

export async function getPosts() {
    const response = await fetch('/api/posts');
    return handleResponse(response);
}

export async function createPost(postData) {
    const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
    });
    return handleResponse(response);
}

export async function vote(postId, voteType) {
    const response = await fetch(`/api/posts/${postId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType }),
    });
    return handleResponse(response);
}

export async function deletePost(postId) {
    const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
    });
    return handleResponse(response);
}
