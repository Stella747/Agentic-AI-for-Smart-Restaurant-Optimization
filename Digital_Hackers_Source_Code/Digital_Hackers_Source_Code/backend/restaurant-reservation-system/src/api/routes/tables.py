from fastapi import APIRouter

router = APIRouter(prefix='/tables')

@router.get('/')
def get_tables():
    return {'message': 'List of tables'}