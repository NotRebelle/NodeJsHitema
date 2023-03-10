db.createUser(
    {
        user: "admin",
        pwd: "root",
        roles: [
            {
                role: "readWrite",
                db: "universal_studios"
            }
        ]
    }
);

db.createCollection("users");

db.users.insertOne({
    "name": "admin",
    "email": "admin@universal.com",
    "password": {
        "salt": '6d01cebf915f',
        "password": '96632c54b6f99f79952282f2baf8a07e77739014bfcd4162b449c0e401d2da09804fbf743698310c460861c2fc6cfa0fab6396c7d5d85dff48b1c324f9d615e4'
    },
    "role": "admin",
    "created_at": new Date(),
    "updated_at": new Date()
});
