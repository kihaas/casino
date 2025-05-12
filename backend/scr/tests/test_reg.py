def test_register_route(client):
    response = client.post('/api/auth/register', json={
        'username': 'newuser',
        'email': 'new@user.com',
        'password': 'password123'
    })
    assert response.status_code == 201
    assert b'User created' in response.data


def test_duplicate_registration(client):
    # First registration
    client.post('/api/auth/register', json={
        'username': 'duplicate',
        'email': 'duplicate@test.com',
        'password': 'password123'
    })

    # Second registration with same email
    response = client.post('/api/auth/register', json={
        'username': 'duplicate2',
        'email': 'duplicate@test.com',
        'password': 'password123'
    })
    assert response.status_code == 400