import firebase_admin
from firebase_admin import credentials, firestore

try:
    cred = credentials.Certificate('./firebase-creds.json')
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print('✅ Firebase connection test successful')
    print(f'✅ Project ID: {cred.project_id}')
    
    test_ref = db.collection('test').document('connection_test')
    test_ref.set({'timestamp': firestore.SERVER_TIMESTAMP, 'status': 'connected'})
    print('✅ Firestore write test successful')
    
    doc = test_ref.get()
    if doc.exists:
        print('✅ Firestore read test successful')
        print(f'✅ Test document data: {doc.to_dict()}')
    else:
        print('❌ Firestore read test failed - document not found')
        
except Exception as e:
    print(f'❌ Firebase connection test failed: {e}')
    import traceback
    traceback.print_exc()
