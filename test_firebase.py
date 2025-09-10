from google.oauth2 import service_account
from google.cloud import firestore

try:
    gcred = service_account.Credentials.from_service_account_file('./firebase-creds.json')
    db = firestore.Client(project=gcred.project_id, credentials=gcred, database='default')
    print('✅ Firestore client created')
    print(f'✅ Project ID: {gcred.project_id}')
    print('✅ Database ID: default')

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
