const { get_constellations, get_regions, get_systems, get_types, get_groups, get_graphics, get_categorys } = require("./universe_query");

const run_once = [ get_constellations, get_regions, get_systems, get_types, get_groups, get_graphics, get_categorys ]

async function main () {
    const static_info = run_once.map(query => query.run())

    await Promise.all(static_info)
} 

main()