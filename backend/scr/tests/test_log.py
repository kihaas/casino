def test_login_success(client):
    # Register first
    client.post('/api/auth/register', json={
        'username': 'loginuser',
        'email': 'login@test.com',
        'password': 'password123'
    })

    # Then login
    response = client.post('/api/auth/login', json={
        'email': 'login@test.com',
        'password': 'password123'
    })
    assert response.status_code == 200
    assert 'access_token' in response.json


def test_login_failure(client):
    response = client.post('/api/auth/login', json={
        'email': 'nonexistent@test.com',
        'password': 'wrongpass'
    })
    assert response.status_code == 401
    assert b'Invalid credentials' in response.data