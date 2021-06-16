const { cms } = require('@tensei/cms')
const { auth } = require('@tensei/auth')
const { rest } = require('@tensei/rest')
const { media } = require('@tensei/media')
const { markdown, mde} = require("@tensei/mde")
const { tensei, welcome, resource, textarea, belongsTo, text, array, hasMany} = require('@tensei/core')

tensei()
    .root(__dirname)
    .resources([
        resource("Recipe")
        .canInsert((request) => request.user)
        .fields([
            text("Nom").rules("required", "max:70"),
            markdown("Description").rules("required", "max:2000"),
            belongsTo("User").creationRules("required"),
            array("ingredients").of("string").rules("required"),
            array("instructions").of("string").rules("required")
        ]),
        resource("Comment")
        .canInsert((request) => request.user)
        .fields([
            belongsTo("User").creationRules("required"),
            belongsTo("Recipe").creationRules("required"),
            markdown("Body").rules("required")
        ]),

    ])
    .plugins([
        welcome(),
        mde().plugin(),
        cms().plugin(),
        media().plugin(),
        auth().setup(({ user }) => {
        	user.fields([
            	hasMany("Recipe"),
                hasMany("Comment")
            ])
        }).plugin(),
        rest().plugin(),

    ])
    .databaseConfig({
        debug: true
    })
    .start()
    .catch(console.error)
