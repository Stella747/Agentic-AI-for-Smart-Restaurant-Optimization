from fastapi import APIRouter

router = APIRouter(prefix='/guests')

@router.get('/')
def get_guests():
    return {'message': 'List of guests'}