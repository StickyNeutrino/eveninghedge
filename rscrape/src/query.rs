trait Query {
    fn run(mut &self);
}

struct MarketRegionQuery {
    region_id: u64;
    future: 
}

struct MarketRegionPageQuery {
    region_id: u64;
    page: u32;
    page_callback: Fn (u32) -> (); 
}

impl MarketRegionPageQuery {
    async run_loop() {
        let page = ;

        await page;

        page callback;

        save orders 

        await next next run 

        loop
    }
}

impl Query for MarketRegionPageQuery {

    impl MarketRegionPageQuery {
        async run_loop() {

            const BUFFER_SIZE: usize = 64;
            let (tx, mut rx) = mpsc::channel::<i32>(BUFFER_SIZE);

            let page_callback = |num_pages: u32| async { tx.send(num_pages); }

            fetch page 1

            loop {
                self.set_num_pages( rx.next().await, page_callback );
            }
        }

        fn start_page_fetch(&mut self, page: u32) {
            self.pages
        }

        fn set_num_pages(num_pages: u32, page_callback: Fn (u32) -> ()) {

        }
    }
    fn run(mut &self){
        futures::executor::block_on( self.run_loop() )
    }
}