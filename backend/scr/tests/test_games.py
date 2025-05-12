def test_roulette_spin_valid(client):
    # Register and login to get token
    client.post('/api/auth/register', json={
        'username': 'rouletteuser',
        'email': 'roulette@test.com',
        'password': 'password123'
    })
    login_resp = client.post('/api/auth/login', json={
        'email': 'roulette@test.com',
        'password': 'password123'
    })
    token = login_resp.json['access_token']

    # Test spin
    response = client.post('/api/games/roulette/spin',
                           headers={'Authorization': f'Bearer {token}'},
                           json={'amount': 10}
                           )
    assert response.status_code == 200
    assert 'result' in response.json
    assert 'new_balance' in response.json


def test_roulette_insufficient_balance(client):
    # Register and login to get token
    client.post('/api/auth/register', json={
        'username': 'pooruser',
        'email': 'poor@test.com',
        'password': 'password123'
    })
    login_resp = client.post('/api/auth/login', json={
        'email': 'poor@test.com',
        'password': 'password123'
    })
    token = login_resp.json['access_token']

    # Test spin with too high amount
    response = client.post('/api/games/roulette/spin',
                           headers={'Authorization': f'Bearer {token}'},
                           json={'amount': 1000}
                           )
    assert response.status_code == 400
    assert b'Insufficient balance' in response.data