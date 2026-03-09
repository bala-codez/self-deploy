from sqlalchemy.testing.pickleable import User


class UserRepository:

    def get_user_by_email(self, db,email: str):
        return db.query(User).filter(User.email == email).first()