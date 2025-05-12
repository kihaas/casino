def test_balance_update_on_win(client):
    # Setup user with known balance
    with client.application.app_context():
        from backend.scr.models.models import User
        user = User(username='balanceuser', email='balance@test.com',
                   password_hash='hash', balance=100)
        db.session.add(user)
        db.session.commit()

        # Get token
        token = create_access_token(identity=user.id)

    # Mock a winning spin (we'll need to patch random.randint)
    with patch('random.randint', return_value=2):  # even number = win
        response = client.post('/api/games/roulette/spin',
            headers={'Authorization': f'Bearer {token}'},
            json={'amount': 10}
        )
        assert response.status_code == 200
        assert response.json['new_balance'] == 110  # 100 - 10 + 20